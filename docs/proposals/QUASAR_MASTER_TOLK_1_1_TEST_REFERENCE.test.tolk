import "quasar/QuasarMaster"
import "@acton/testing"

@Test
fun test_mint_respects_anti_whale() {
    val ctx = testing.createContext();
    val admin = testing.createWallet(1000 ton);
    val master = ctx.deploy<QuasarMaster>(admin, {
        maxSupply: 1_000_000, antiWhaleLimit: 10_000,
        mintingEnabled: true, admin: admin.address,
        walletCode: beginCell().endCell(),
    });
    master.mint(admin, 5000, admin.address);
    assert master.totalSupply() == 5000;
}

@Test
@test.fail_with(406)  // Acton: ожидаемый код выхода[reference:2]
fun test_mint_rejects_over_anti_whale() {
    val ctx = testing.createContext();
    val admin = testing.createWallet(1000 ton);
    val master = ctx.deploy<QuasarMaster>(admin, {
        maxSupply: 1_000_000, antiWhaleLimit: 10_000,
        mintingEnabled: true, admin: admin.address,
        walletCode: beginCell().endCell(),
    });
    master.mint(admin, 20_000, admin.address);
}

@Test
fun test_burn_requires_admin() {
    val ctx = testing.createContext();
    val admin = testing.createWallet();
    val nonAdmin = testing.createWallet();
    val master = ctx.deploy<QuasarMaster>(admin, {
        admin: admin.address, walletCode: beginCell().endCell(),
    });
    // handleBurn теперь требует админа
    master.burn(admin, 100, admin.address);  // OK
    expect(401).toThrow(nonAdmin, master.burn(nonAdmin, 50, nonAdmin.address));
}

@Test
fun test_ai_multisig_requires_threshold() {
    val ctx = testing.createContext();
    val s1 = testing.createWallet(); val s2 = testing.createWallet();
    val master = ctx.deploy<QuasarMaster>(ctx.admin, {
        aiSigners: [s1.address, s2.address], aiThreshold: 2, aiAutonomy: true,
        admin: ctx.admin.address, walletCode: beginCell().endCell(),
    });
    master.aiApprove(s1, 0x33333333, 500, zeroAddress);
    assert master.feeBps() == 0;
    master.aiApprove(s2, 0x33333333, 500, zeroAddress);
    assert master.feeBps() == 500;
}

@Test
@test.fail_with(417)
fun test_ai_single_point_rejected() {
    val ctx = testing.createContext();
    val signer = testing.createWallet();
    val master = ctx.deploy<QuasarMaster>(ctx.admin, {
        aiSigners: [signer.address], aiThreshold: 1, aiAutonomy: true,
        admin: ctx.admin.address, walletCode: beginCell().endCell(),
    });
    master.aiSinglePoint(signer, 0x33333333);
}

@test.fuzz
fun test_mint_never_exceeds_max_supply(amount: uint32) {
    val ctx = testing.createContext();
    val admin = testing.createWallet(1000 ton);
    val master = ctx.deploy<QuasarMaster>(admin, {
        maxSupply: 100_000, antiWhaleLimit: 100_000,
        mintingEnabled: true, admin: admin.address,
        walletCode: beginCell().endCell(),
    });
    if (amount > 100_000) {
        // ожидаем ошибку 407
    } else {
        master.mint(admin, amount, admin.address);
        assert master.totalSupply() <= 100_000;
    }
}

@Test
fun test_migrate_does_not_overwrite_data() {
    val ctx = testing.createContext();
    val admin = testing.createWallet();
    val master = ctx.deploy<QuasarMaster>(admin, {
        admin: admin.address, migrationTarget: admin.address,
        walletCode: beginCell().endCell(),
    });
    val newData = beginCell().storeUint(42, 32).endCell();
    val newCode = beginCell().endCell();
    master.migrate(admin, newCode, newData);
    // После миграции storage должен содержать newData, а не старый st
    val stored = contract.getData();
    assert stored.beginParse().loadUint(32) == 42;
}
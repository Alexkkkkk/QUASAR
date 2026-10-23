import "@stdlib/gas-payments"
// Positional CLI argument is parsed by Acton against main()'s ABI.
import "@acton/io"
import "@acton/emulation/network"
import "@gen/QuasarWallet.code"

fun main(duration: int) {
    assert (!net.isBroadcasting()) throw 200;
    assert (duration > 0 && duration <= 315360000) throw 201;
    val code = quasarWalletCompiledCode();
    val gasBefore = getGasConsumedAtTheMoment();
    val (cells, bits, _) = code.calculateSizeStrict(2048);
    val gasUsed = getGasConsumedAtTheMoment() - gasBefore;
    val storageFee = calculateStorageFee(BASECHAIN, duration, bits, cells);
    val computationFee = calculateGasFeeWithoutFlatPrice(BASECHAIN, gasUsed);
    println("Wallet code storage estimate for {} seconds: {:grams}", duration, storageFee);
    println("Size calculation gas estimate: {:grams}", computationFee);
}

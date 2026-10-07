import { CHAIN } from "@tonconnect/sdk";
import { Address } from "ton";
import { getToncenterProxyUrl } from "./toncenter-credentials";

export type Network = "mainnet" | "testnet";

/**
 * Toncenter credentials are not part of this module on purpose. A key in the
 * client bundle is public (issue #141); see ./toncenter-credentials for the
 * runtime-injection contract and the keyless fallback.
 */
export const NETWORK_CONFIG: Record<
  Network,
  {
    chain: CHAIN;
    toncenterV2: string;
    toncenterV3: string;
    explorer: string;
  }
> = {
  mainnet: {
    chain: CHAIN.MAINNET,
    toncenterV2: "https://toncenter.com/api/v2/jsonRPC",
    toncenterV3: "https://toncenter.com/api/v3",
    explorer: "https://tonscan.org",
  },
  testnet: {
    chain: CHAIN.TESTNET,
    toncenterV2: "https://testnet.toncenter.com/api/v2/jsonRPC",
    toncenterV3: "https://testnet.toncenter.com/api/v3",
    explorer: "https://testnet.tonscan.org",
  },
};

export type ToncenterApi = "v2" | "v3";

/**
 * Resolve a Toncenter base URL for a network. When the host injects a
 * same-origin proxy, calls go through it so the API key stays server-side;
 * otherwise the public Toncenter endpoint is used keyless.
 */
export function getToncenterBaseUrl(network: Network, api: ToncenterApi): string {
  return getToncenterProxyUrl() ?? NETWORK_CONFIG[network][api === "v2" ? "toncenterV2" : "toncenterV3"];
}

export function getNetwork(params: URLSearchParams): Network {
  const value = params.get("testnet");
  return value !== null && value !== "false" && value !== "0" ? "testnet" : "mainnet";
}

export function getCurrentNetwork(): Network {
  return getNetwork(new URLSearchParams(window.location.search));
}

export function formatAddress(
  address: Address | string,
  network: Network,
  bounceable = true,
): string {
  const parsed = typeof address === "string" ? Address.parse(address) : address;
  return parsed.toFriendly({
    urlSafe: true,
    bounceable,
    testOnly: network === "testnet",
  });
}

export function formatRawAddress(address: Address | string): string {
  return (typeof address === "string" ? Address.parse(address) : address).toString();
}

export function setSearchParam(
  params: URLSearchParams,
  name: string,
  value?: string,
): URLSearchParams {
  const next = new URLSearchParams(params);
  if (value) {
    next.set(name, value);
  } else {
    next.delete(name);
  }
  return next;
}

/**
 * Toncenter credentials are NEVER bundled into the browser build.
 *
 * Everything compiled into the client bundle is public: a Toncenter API key
 * placed in this application is readable by every visitor of the deployed
 * site (issue #141). The key is therefore not a build-time constant. The
 * hosting server may inject it at runtime, and the client falls back to
 * keyless requests when no key is available.
 *
 * Runtime injection contract: the page served by the host may define
 * `window.__TONCENTER_RUNTIME_CONFIG__` before this bundle executes, e.g.
 *
 *   <script>
 *     window.__TONCENTER_RUNTIME_CONFIG__ = { proxyUrl: "/api/toncenter" };
 *   </script>
 *
 * `proxyUrl` is the preferred form: a same-origin server endpoint that
 * attaches `X-API-Key` server-side, so the key never reaches the browser.
 * `apiKey` exists only for a server-side render or a test harness and must
 * never be populated from a build-time environment variable.
 */

export type ToncenterRuntimeConfig = {
  /** Same-origin endpoint of the server proxy that injects the API key. */
  proxyUrl?: string;
  /**
   * Server-side / test-harness only. Never set this from a build-time
   * variable such as `process.env.REACT_APP_*` or `import.meta.env.VITE_*`:
   * a build-time constant ends up in the public bundle.
   */
  apiKey?: string;
};

declare global {
  interface Window {
    __TONCENTER_RUNTIME_CONFIG__?: ToncenterRuntimeConfig;
  }
}

function readRuntimeConfig(): ToncenterRuntimeConfig {
  if (typeof window === "undefined") return {};
  const config = window.__TONCENTER_RUNTIME_CONFIG__;
  return config && typeof config === "object" ? config : {};
}

/** Optional API key. `undefined` means "send keyless requests". */
export function getToncenterApiKey(): string | undefined {
  const key = readRuntimeConfig().apiKey;
  return typeof key === "string" && key.trim() !== "" ? key.trim() : undefined;
}

/** Optional same-origin proxy prefix for Toncenter RPC calls. */
export function getToncenterProxyUrl(): string | undefined {
  const proxy = readRuntimeConfig().proxyUrl;
  return typeof proxy === "string" && proxy.trim() !== "" ? proxy.trim() : undefined;
}

/** Headers for a direct Toncenter REST call. Empty when running keyless. */
export function getToncenterHeaders(): Record<string, string> {
  const apiKey = getToncenterApiKey();
  return apiKey ? { "X-API-Key": apiKey } : {};
}

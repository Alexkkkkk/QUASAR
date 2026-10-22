import "@testing-library/jest-dom/vitest";
import { TextDecoder, TextEncoder } from "node:util";

// JSDOM intentionally omits these browser/Node globals, while React Router and
// the app's tests rely on them in modern Node runtimes.
if (typeof globalThis.TextEncoder === "undefined") {
  Object.defineProperty(globalThis, "TextEncoder", { configurable: true, value: TextEncoder });
}
if (typeof globalThis.TextDecoder === "undefined") {
  Object.defineProperty(globalThis, "TextDecoder", { configurable: true, value: TextDecoder });
}
if (typeof globalThis.fetch !== "function") {
  Object.defineProperty(globalThis, "fetch", {
    configurable: true,
    writable: true,
    value: () => Promise.reject(new Error("fetch mock was not configured for this test")),
  });
}

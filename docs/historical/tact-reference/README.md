# Historical Tact reference

This directory preserves the former Tact source, its generated-wrapper sandbox
suites, configuration, and network-operation scripts as audit evidence for the
Tolk cutover. It is **not** an active build input and is excluded from CI,
TypeScript checks, deployment tooling, ABI gates, and release artifacts.

The preserved files describe a different code hash, StateInit format, address
space, and storage schema. They must not be used to deploy, upgrade, or infer
compatibility of the Tolk generation.

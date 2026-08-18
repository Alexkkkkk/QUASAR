---
name: Tact runtime compatibility
description: Runtime requirements and package-install constraints for this TON/Tact project.
---

The current Tact compiler line uses modern JavaScript `Set` methods, so the project runtime must be Node.js 22 or newer. Its dependency graph also includes an old `protobufjs` release that can be rejected by Replit's security firewall; pinning the transitive package through the package manager override keeps installation reproducible without bypassing the firewall.

**Why:** The imported project originally targeted Node.js 20 and failed before compiling, while the unmodified dependency graph was blocked during installation.

**How to apply:** Keep the Replit runtime on Node.js 22+ and preserve the safe `protobufjs` override when refreshing dependencies.
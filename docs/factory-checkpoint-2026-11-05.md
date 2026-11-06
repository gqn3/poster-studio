# Factory checkpoint — 2026-11-05

Queue authority: https://github.com/gqn3/saas-platform/issues/23. Do not start parallel workers on the same branch. This file is a checkpoint, not an autonomous runner.

| Product | Repository / branch | State | Next action |
| --- | --- | --- | --- |
| Poster Studio | gqn3/poster-studio / feature/tapndo-poster-studio | In progress, draft PR #1; no staging | Verify image rendering after reload and quota error in Chromium; test edit, move, resize, layers, undo/redo and export at 390/768/1440; complete localization and license/security review. |
| Reactive Resume | gqn3/tapndo-reactive-resume / wip/arabic-pdf-export-gate | Preserved; cloned; feature branch remains remote | Resume only after Poster readiness or a genuine blocker. |
| Platform | gqn3/saas-platform / main | Queue and policies | Keep issue #23 as task authority. |

This change makes image insertion local, with a 2 MB per-file cap, and prevents quota recovery from silently deleting another project. Storage remains localStorage: total quota is limited and saving can fail; users are warned on autosave failure. Verify durability and quota handling before staging. Background removal and remote integrations remain disabled. No scheduler or unattended coding worker has been verified or activated. Codex CLI has noninteractive mode and ChatGPT login, but recurring usage cost/limits and safe recovery are not established.

CranL account check: enterprise, one app and one database. The account's estimate for one app reports $0 extra monthly, but usage limits and deployment readiness remain to be checked. No resource was created or changed. No production or DNS changes.

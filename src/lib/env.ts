// Feature flags. ?debug enables the perf HUD and dev-only probes.
export const DEBUG = new URLSearchParams(window.location.search).has('debug');

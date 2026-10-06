// A time limit for Supabase database, RPC and auth calls (2026-10-05).
//
// supabase-js passes requests straight to fetch, which has no timeout: on a
// dropped mobile connection a read can hang until the browser gives up,
// which can take minutes, and the page that waits on it spins all along.
// With a limit the call fails as a network error: auth retries its token
// refresh, and the pages show their retry state. Storage uploads and edge
// functions are left alone, since a large upload may honestly take longer.

export const DEFAULT_TIMEOUT_MS = 20000;

export function isTimedPath(url) {
  return /\/(rest|auth)\/v1\//.test(String(url));
}

export function makeFetchWithTimeout(baseFetch, timeoutMs = DEFAULT_TIMEOUT_MS) {
  return (input, init = {}) => {
    const url = typeof input === 'string' ? input : input?.url;
    if (!isTimedPath(url)) return baseFetch(input, init);

    const ctrl = new AbortController();
    const timer = setTimeout(() => {
      const err = new Error(`Request timed out after ${Math.round(timeoutMs / 1000)} s`);
      err.name = 'TimeoutError';
      ctrl.abort(err);
    }, timeoutMs);
    const callerSignal = init.signal;
    if (callerSignal) {
      if (callerSignal.aborted) ctrl.abort(callerSignal.reason);
      else callerSignal.addEventListener('abort', () => ctrl.abort(callerSignal.reason), { once: true });
    }
    return Promise.resolve(baseFetch(input, { ...init, signal: ctrl.signal }))
      .finally(() => clearTimeout(timer));
  };
}

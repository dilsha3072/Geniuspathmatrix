/**
 * A robust wrapper around the native `fetch` function.
 * - Throws an error if the response is not ok.
 * - Automatically sets 'Content-Type': 'application/json' for requests with a body.
 * - Throws a specific, detailed error if the server responds with HTML instead of JSON.
 * - Provides detailed debug information in case of an error.
 *
 * @example
 * const data = await fetchJson('/api/user', {
 *   method: 'POST',
 *   body: JSON.stringify({ name: 'John Doe' }),
 * });
 */
export async function fetchJson(
  input: RequestInfo | URL,
  init: RequestInit = {}
): Promise<any> {
  // Ensure JSON content-type on requests where a body is provided
  if (init.body && !init.headers) {
    init.headers = { 'Content-Type': 'application/json' };
  }
  if (init.body && init.headers && !('Content-Type' in init.headers)) {
    // @ts-ignore
    init.headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(input, init);

  // Read the response body as text to handle non-JSON responses gracefully
  const text = await res.text().catch(() => null);

  // Prepare a helpful debug object for error reporting
  const debug = {
    url: typeof input === 'string' ? input : input?.url || 'unknown',
    status: res.status,
    statusText: res.statusText,
    contentType: res.headers.get('content-type') || '',
    bodySnippet: typeof text === 'string' ? text.slice(0, 1500) : null,
  };

  // If the server likely returned an HTML error page, throw a clear error.
  if (debug.contentType.includes('text/html') || (typeof text === 'string' && text.trim().startsWith('<'))) {
    console.error('fetchJson - Expected JSON but received HTML/unknown. Debug:', debug);
    const err = new Error(`Expected JSON but received HTML (status ${debug.status}). This often happens with server errors or misconfigured hosting redirects.`);
    // @ts-ignore
    err.debug = debug;
    throw err;
  }

  let data;
  try {
    // If there's no body, return undefined instead of trying to parse
    if (!text) {
        data = undefined;
    } else {
        data = JSON.parse(text);
    }
  } catch (e) {
    console.error('fetchJson - Failed to parse JSON response. Debug:', debug, e);
    const err = new Error('Response was not valid JSON.');
     // @ts-ignore
    err.debug = debug;
    throw err;
  }

  // If the response was not ok (e.g., 4xx, 5xx), throw an error with the parsed body
  if (!res.ok) {
    console.error('fetchJson - Non-OK response. Debug:', debug);
    // Use the parsed data as the error message if possible, otherwise use status text
    const message = data?.message || data?.error || res.statusText;
    const err = new Error(message);
     // @ts-ignore
    err.debug = debug;
    // @ts-ignore
    err.response = res;
    // @ts-ignore
    err.data = data;
    throw err;
  }

  return data;
}

/**
 * A robust wrapper around the native `fetch` function.
 * - Throws an error if the response is not ok.
 * - Automatically sets 'Content-Type': 'application/json' for requests with a body.
 * - Throws a specific, detailed error if the server responds with HTML or non-JSON content.
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
    bodySnippet: typeof text === 'string' ? text.slice(0, 500) : null,
  };

  // If the response was not ok (e.g., 4xx, 5xx), throw an error with as much detail as possible.
  if (!res.ok) {
    console.error('fetchJson - Non-OK response. Debug:', debug);
    let message = `Request failed with status ${res.status}`;
    try {
        const errorJson = JSON.parse(text || '{}');
        message = errorJson.message || errorJson.error || message;
    } catch (e) {
        // Not a JSON error response, use the body snippet if available
        if (debug.bodySnippet) {
            message = `Request failed with status ${res.status}. Response: ${debug.bodySnippet}`;
        }
    }
    const err = new Error(message);
    // @ts-ignore
    err.debug = debug;
    // @ts-ignore
    err.response = res;
    throw err;
  }
  
  // If the response IS ok, but the content type is not JSON, throw a clear error.
  if (!debug.contentType.includes('application/json')) {
      const err = new Error(`Expected JSON response but received '${debug.contentType}'. Response body: ${debug.bodySnippet}`);
      // @ts-ignore
      err.debug = debug;
      throw err;
  }

  try {
    // If there's no body, return undefined instead of trying to parse
    if (!text) {
        return undefined;
    }
    return JSON.parse(text);
  } catch (e) {
    console.error('fetchJson - Failed to parse JSON response. Debug:', debug, e);
    const err = new Error('Response was not valid JSON.');
     // @ts-ignore
    err.debug = debug;
    throw err;
  }
}

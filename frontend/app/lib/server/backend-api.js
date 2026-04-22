const BACKEND_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || "http://localhost:18080";

function buildBackendUrl(pathname) {
  return new URL(pathname, BACKEND_API_BASE_URL).toString();
}

export async function fetchBackend(request, pathname, init = {}) {
  const headers = new Headers(init.headers);
  const cookie = request.headers.get("cookie");

  if (cookie && !headers.has("cookie")) {
    headers.set("cookie", cookie);
  }

  return fetch(buildBackendUrl(pathname), {
    ...init,
    headers,
    cache: "no-store",
  });
}

export async function readJsonResponse(response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

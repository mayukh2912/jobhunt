const BASE = "/api/jobs";

async function handle(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
}

export const jobsApi = {
  list: (search) =>
    fetch(`${BASE}${search ? `?search=${encodeURIComponent(search)}` : ""}`).then(handle),
  create: (body) =>
    fetch(BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(handle),
  update: (id, body) =>
    fetch(`${BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(handle),
  toggle: (id) => fetch(`${BASE}/${id}/toggle`, { method: "PATCH" }).then(handle),
  remove: (id) => fetch(`${BASE}/${id}`, { method: "DELETE" }).then(handle),
};

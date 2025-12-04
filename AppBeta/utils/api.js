const BASE = 'http://192.168.0.120:3000/api';

async function request(path, method = 'GET', body = null, token = null) {
  const headers = { Accept: 'application/json' };
  if (body && !(body instanceof FormData)) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(BASE + path, {
    method,
    headers,
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : null,
  });

  return res.json();
}

export default {
  get: (path, token) => request(path, 'GET', null, token),
  post: (path, body, token) => request(path, 'POST', body, token),
};

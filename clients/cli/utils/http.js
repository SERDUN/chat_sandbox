import fetch from 'node-fetch';

const defaultHeaders = { 'Content-Type': 'application/json' };

async function request(url, method = 'GET', body = null) {
  const options = {
    method,
    headers: defaultHeaders,
    ...(body && { body: body }),
  };

  return fetch(url, options);
}

export default {
  get: (url) => request(url),
  post: (url, body) => request(url, 'POST', body),
};
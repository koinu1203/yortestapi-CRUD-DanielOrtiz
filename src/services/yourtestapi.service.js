/**
 * @typedef {import('../types/yourtestapi.js').YourTestApiItem} YourTestApiItem
 */

const BASE_URL = import.meta.env.VITE_API_URL

if (!BASE_URL) {
  // eslint-disable-next-line no-console
  console.warn('VITE_API_URL is not defined. Set it in the .env file.')
}

const buildUrl = (path = '') => {
  const normalizedBase = BASE_URL?.replace(/\/+$/, '') || ''
  const normalizedPath = path.replace(/^\/+/, '')
  return normalizedPath ? `${normalizedBase}/${normalizedPath}` : normalizedBase
}

const request = async (path, options = {}) => {
  const response = await fetch(buildUrl(path), {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText)
    throw new Error(message || `Request failed with ${response.status}`)
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

export const yourTestApiService = {
  getAll: () => request('api/posts/', { method: 'GET' }),
  getById: (id) => request(`api/posts/${id}?`),
  /** @param {YourTestApiItem} data */
  create: (data) =>
    request('api/posts/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  /** @param {YourTestApiItem} data */
  update: (id, data) =>
    request(`api/posts/${id}?`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  remove: (id) =>
    request(`api/posts/${id}?`, {
      method: 'DELETE',
    }),
}

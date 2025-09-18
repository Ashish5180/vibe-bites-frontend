// API utility functions
const getApiUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || '/api'
}

const buildApiUrl = (endpoint) => {
  const baseUrl = getApiUrl()
  // Remove trailing slash from baseUrl and leading slash from endpoint
  const cleanBaseUrl = baseUrl.replace(/\/$/, '')
  const cleanEndpoint = endpoint.replace(/^\//, '')
  return `${cleanBaseUrl}/${cleanEndpoint}`
}

export { getApiUrl, buildApiUrl }

const defaultHeaders = {
  'Content-Type': 'application/json'
}

type ApiFetchOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  credentials?: any
  body?: any
}

const apiFetch = {
  get: async (url: RequestInfo, serviceOptions: ApiFetchOptions) => {
    const options = {
      ...serviceOptions,
      method: 'GET'
    }
    options.headers = { ...defaultHeaders, ...options.headers }

    const data = await fetch(url, options)
    return data.json()
  },

  post: async (url: RequestInfo, serviceOptions: ApiFetchOptions) => {
    const options = {
      ...serviceOptions,
      method: 'POST'
    }
    options.headers = { ...defaultHeaders, ...options.headers }

    const data = await fetch(url, options)
    return data.json()
  },

  put: async (url: RequestInfo, serviceOptions: ApiFetchOptions) => {
    const options = {
      ...serviceOptions,
      method: 'PUT'
    }
    options.headers = { ...defaultHeaders, ...options.headers }

    const data = await fetch(url, options)
    return data.json()
  },

  delete: async (url: RequestInfo, serviceOptions: ApiFetchOptions) => {
    const options = {
      ...serviceOptions,
      method: 'DELETE'
    }
    options.headers = { ...defaultHeaders, ...options.headers }

    const data = await fetch(url, options)
    return data.json()
  }
}

export default apiFetch

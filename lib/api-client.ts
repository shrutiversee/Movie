const API_BASE_URL = "/api"

class ApiClient {
  private token: string | null = null

  constructor() {
    // Get token from localStorage on client side
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token")
    }
  }

  setToken(token: string | null) {
    this.token = token
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("auth_token", token)
      } else {
        localStorage.removeItem("auth_token")
      }
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.request<{
      message: string
      user: { _id: string; email: string; name: string; createdAt: Date; updatedAt: Date }
      token: string
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
    this.setToken(response.token)
    return response
  }

  async register(email: string, password: string, name: string) {
    const response = await this.request<{
      message: string
      user: { _id: string; email: string; name: string; createdAt: Date; updatedAt: Date }
      token: string
    }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    })
    this.setToken(response.token)
    return response
  }

  async getProfile() {
    return this.request<{ user: { _id: string; email: string; name: string; createdAt: Date; updatedAt: Date } }>(
      "/auth/me",
    )
  }

  async logout() {
    this.setToken(null)
  }

  // Movies endpoints
  async getMovies(params?: {
    search?: string
    page?: number
    limit?: number
  }) {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString())
        }
      })
    }
    const query = searchParams.toString()
    return this.request<{
      movies: Array<{
        _id: string
        title: string
        publishingYear: number
        poster?: string
        createdAt: Date
        updatedAt: Date
      }>
      total: number
      page: number
      limit: number
      totalPages: number
    }>(`/movies${query ? `?${query}` : ""}`)
  }

  async getMovie(id: string) {
    return this.request<{
      movie: {
        _id: string
        title: string
        publishingYear: number
        poster?: string
        createdAt: Date
        updatedAt: Date
      }
    }>(`/movies/${id}`)
  }

  async createMovie(data: { title: string; publishingYear: number; poster?: string }) {
    return this.request<{
      message: string
      movie: {
        _id: string
        title: string
        publishingYear: number
        poster?: string
        createdAt: Date
        updatedAt: Date
      }
    }>("/movies", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateMovie(id: string, data: Partial<{ title: string; publishingYear: number; poster: string }>) {
    return this.request<{
      message: string
      movie: {
        _id: string
        title: string
        publishingYear: number
        poster?: string
        updatedAt: Date
      }
    }>(`/movies/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteMovie(id: string) {
    return this.request<{ message: string }>(`/movies/${id}`, {
      method: "DELETE",
    })
  }

  // Upload endpoints
  async uploadImage(file: File) {
    const formData = new FormData()
    formData.append("file", file)

    const headers: HeadersInit = {}
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      headers,
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `Upload failed! status: ${response.status}`)
    }

    return response.json() as Promise<{
      message: string
      url: string
      publicId: string
    }>
  }
}

export const apiClient = new ApiClient()

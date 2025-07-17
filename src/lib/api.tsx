const API_BASE_URL = "https://testnode-alpha-dun.vercel.app/api"

export interface User {
  username: string
  email: string
  password?: string
  address: string | null
  phone: string | null
  firstName: string | null
  lastName: string | null
}

export interface AuthResponse {
  success: boolean
  message: string
  error?:string
  token?: string
  user?: User
}

export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  error?:string
  data?: T
}

// Auth APIs
export const authAPI = {
  register: async (userData: Omit<User, "password"> & { password: string }): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
    return response.json()
  },

  login: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })
    return response.json()
  },
}

// User APIs
export const userAPI = {
  getProfile: async (token: string): Promise<ApiResponse<User>> => {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
    return response.json()
  },

  updateProfile: async (token: string, userData: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
    return response.json()
  },

  changePassword: async (
    token: string,
    passwordData: { currentPassword: string; newPassword: string },
  ): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/user/change-password`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(passwordData),
    })
    return response.json()
  },
}

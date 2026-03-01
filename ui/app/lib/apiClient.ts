import axios, { AxiosError } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Create axios instance
const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;

// Types
export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Task {
  id: number;
  user_id: number;
  title: string;
  flag: "Ongoing" | "Due" | "Complete";
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface TasksResponse {
  tasks: Task[];
}

export interface TaskResponse {
  message: string;
  task: Task;
}

export interface MessageResponse {
  message: string;
}

// Auth API
export const authApi = {
  register: async (
    name: string,
    email: string,
    password: string,
  ): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/register", {
      name,
      email,
      password,
    });
    return response.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/login", {
      email,
      password,
    });
    return response.data;
  },

  logout: async (): Promise<MessageResponse> => {
    const response = await apiClient.post<MessageResponse>("/logout");
    return response.data;
  },

  getUser: async (): Promise<{ user: User }> => {
    const response = await apiClient.get<{ user: User }>("/user");
    return response.data;
  },
};

// Task API
export const taskApi = {
  getTasks: async (): Promise<TasksResponse> => {
    const response = await apiClient.get<TasksResponse>("/tasks");
    return response.data;
  },

  createTask: async (
    title: string,
    flag?: "Ongoing" | "Due" | "Complete",
  ): Promise<TaskResponse> => {
    const response = await apiClient.post<TaskResponse>("/tasks", {
      title,
      flag,
    });
    return response.data;
  },

  updateTask: async (
    id: number,
    data: { title?: string; flag?: "Ongoing" | "Due" | "Complete" },
  ): Promise<TaskResponse> => {
    const response = await apiClient.put<TaskResponse>(`/tasks/${id}`, data);
    return response.data;
  },

  deleteTask: async (id: number): Promise<MessageResponse> => {
    const response = await apiClient.delete<MessageResponse>(`/tasks/${id}`);
    return response.data;
  },
};

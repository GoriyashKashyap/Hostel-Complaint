const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

export interface User {
    id: number;
    email: string;
    role: string;
    full_name?: string;
    semester?: string;
    branch?: string;
    phone?: string;
    hostel?: string;
    room?: string;
    created_at: string;
}

export interface Complaint {
    id: number;
    user_id: number;
    title: string;
    description: string;
    hostel: string;
    block?: string;
    category?: string;
    status: string;
    urgency_score?: number;
    user_phone?: string;
    user_name?: string;
    created_at: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    role?: string;
    full_name?: string;
    semester?: string;
    branch?: string;
    phone?: string;
    hostel?: string;
    room?: string;
}

export interface UserUpdate {
    email?: string;
    full_name?: string;
    semester?: string;
    branch?: string;
    phone?: string;
    hostel?: string;
    room?: string;
}

export interface ComplaintCreate {
    title: string;
    description: string;
    hostel: string;
    block?: string;
    category?: string;
}

export interface ComplaintUpdate {
    status?: string;
    urgency_score?: number;
}

export interface AlertSettings {
    enabled: boolean;
}

class ApiClient {
    private token: string | null = null;

    constructor() {
        // Load token from localStorage on initialization
        this.token = localStorage.getItem("auth_token");
    }

    private getHeaders(): HeadersInit {
        const headers: HeadersInit = {
            "Content-Type": "application/json",
        };

        if (this.token) {
            headers["Authorization"] = `Bearer ${this.token}`;
        }

        return headers;
    }

    private async request<T>(
        endpoint: string,
        options?: RequestInit
    ): Promise<T> {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                ...this.getHeaders(),
                ...options?.headers,
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({
                detail: response.statusText,
            }));
            throw new Error(error.detail || `HTTP ${response.status}`);
        }

        return response.json();
    }

    // Auth methods
    async register(data: RegisterData): Promise<User> {
        return this.request<User>("/users/register", {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    async login(credentials: LoginCredentials): Promise<{ access_token: string; token_type: string }> {
        const response = await this.request<{ access_token: string; token_type: string }>(
            "/users/login",
            {
                method: "POST",
                body: JSON.stringify(credentials),
            }
        );

        // Store token
        this.token = response.access_token;
        localStorage.setItem("auth_token", response.access_token);
        console.log("Token stored:", this.token ? "Yes" : "No");

        return response;
    }

    logout() {
        this.token = null;
        localStorage.removeItem("auth_token");
    }

    async getCurrentUser(): Promise<User> {
        console.log("Getting current user, token:", this.token ? "exists" : "missing");
        console.log("Headers:", this.getHeaders());
        return this.request<User>("/users/me");
    }

    async updateCurrentUser(data: UserUpdate): Promise<User> {
        return this.request<User>("/users/me", {
            method: "PATCH",
            body: JSON.stringify(data),
        });
    }

    // Complaint methods
    async createComplaint(data: ComplaintCreate): Promise<Complaint> {
        return this.request<Complaint>("/complaints/", {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    async getMyComplaints(): Promise<Complaint[]> {
        return this.request<Complaint[]>("/complaints/me");
    }

    async getAllComplaints(filters?: {
        status?: string;
        category?: string;
        min_urgency?: number;
    }): Promise<Complaint[]> {
        const params = new URLSearchParams();
        if (filters?.status) params.append("status", filters.status);
        if (filters?.category) params.append("category", filters.category);
        if (filters?.min_urgency) params.append("min_urgency", filters.min_urgency.toString());

        const query = params.toString();
        return this.request<Complaint[]>(`/complaints/${query ? `?${query}` : ""}`);
    }

    async updateComplaint(id: number, data: ComplaintUpdate): Promise<Complaint> {
        return this.request<Complaint>(`/complaints/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        });
    }

    async deleteComplaint(id: number): Promise<Complaint> {
        return this.request<Complaint>(`/complaints/${id}`, {
            method: "DELETE",
        });
    }

    async getAlertSettings(): Promise<AlertSettings> {
        return this.request<AlertSettings>("/settings/alerts");
    }

    async updateAlertSettings(data: AlertSettings): Promise<AlertSettings> {
        return this.request<AlertSettings>("/settings/alerts", {
            method: "PATCH",
            body: JSON.stringify(data),
        });
    }

    isAuthenticated(): boolean {
        return !!this.token;
    }
}

export const apiClient = new ApiClient();

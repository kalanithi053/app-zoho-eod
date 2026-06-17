import { HttpHeaders, MapRequest, MimeTypes } from "@/enums/request.enum";
import Cookies from "js-cookie";

class ApiService {
  protected baseURI: string | undefined;

  constructor() {
    this.baseURI = process.env.NEXT_PUBLIC_API_URL;
  }

  /**
   * Build headers for every request
   */
  private getHeaders(): HeadersInit {
    const token = Cookies.get("access_token");

    const headers: HeadersInit = {
      [HttpHeaders.ContentType]: MimeTypes.ApplicationJson,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Handle common response cases
   */
  private async handleResponse(response: Response): Promise<any> {
    const contentType = response.headers.get("content-type");

    const data = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    // Handle unauthorized
    if (response.status === 401) {
      Cookies.remove("access_token");
      window.location.reload();
      return {
        success: false,
        status: 401,
        message: data?.message || "Unauthorized",
      };
    }

    // Handle non-success responses
    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        message: data?.message || "Something went wrong",
      };
    }

    return data;
  }

  public async request(method: MapRequest, url: string, data?: unknown) {
    const response = await fetch(`${this.baseURI}${url}`, {
      method: method.toUpperCase(),
      headers: this.getHeaders(),
      credentials: "include",
      ...(method !== MapRequest.get &&
        data !== undefined && {
          body: JSON.stringify(data),
        }),
    });

    return this.handleResponse(response);
  }

  /**
   * Optional helper methods
   */
  public setAuthHeader(token: string): void {
    Cookies.set("access_token", token);
  }

  public clearAuthHeader(): void {
    Cookies.remove("access_token");
  }
}

export default ApiService;

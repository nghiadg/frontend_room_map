// wrapper for fetch with error handling and more
class HttpClientError extends Error {
  constructor(
    message: string,
    public status: number,
    public body: unknown
  ) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

class HttpClient {
  constructor(private readonly baseUrl?: string) {
    this.baseUrl = baseUrl ?? process.env.NEXT_PUBLIC_API_URL ?? "";
  }

  async request<T = unknown>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    const requestUrl = this.baseUrl ? `${this.baseUrl}${url}` : url;
    try {
      const response = await fetch(requestUrl, options);
      if (!response.ok) {
        let errorPayload = null;
        try {
          errorPayload = await response.json();
        } catch (error) {
          console.error("Error parsing JSON response:", error);
          errorPayload = { message: await response.text() };
        }
        const error = new HttpClientError(
          errorPayload?.message || response.statusText,
          response.status,
          errorPayload
        );
        console.error("HTTP client error:", error);
        throw error;
      }
      return response.json();
    } catch (error) {
      // Silently ignore AbortError - this is expected when React Query cancels requests
      if (error instanceof DOMException && error.name === "AbortError") {
        throw error; // Re-throw but don't log - React Query handles this gracefully
      }
      if (error instanceof HttpClientError) {
        throw error;
      }
      throw new HttpClientError(`Network error: ${error}`, 0, null);
    }
  }

  async get<T = unknown>(
    url: string,
    options?: { params?: Record<string, string> }
  ): Promise<T> {
    let requestUrl = url;
    if (options?.params) {
      const queryParams = new URLSearchParams(options.params);
      requestUrl = `${url}?${queryParams}`;
    }
    return this.request<T>(requestUrl, { method: "GET" });
  }
}

export const httpClient = new HttpClient();
export default HttpClient;

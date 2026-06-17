export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: {
    next: number | null;
    previous: number | null;
    count: number;
    results: T[];
  };
}

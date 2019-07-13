export interface ApiResponse<T> {
  count: number;
  rows: T[];
}

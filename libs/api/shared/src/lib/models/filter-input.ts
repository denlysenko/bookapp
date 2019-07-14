export interface FilterInput {
  filter?: { field: string; search: string };
  skip?: number;
  first?: number;
  orderBy?: string;
}

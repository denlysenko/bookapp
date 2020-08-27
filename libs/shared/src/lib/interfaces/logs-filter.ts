export interface LogsFilter {
  skip?: number;
  first?: number;
  orderBy?: 'createdAt_desc' | 'createdAt_asc';
}

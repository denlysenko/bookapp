export class ApiQuery {
  constructor(
    public filter: { [key: string]: string | RegExp | boolean } = null,
    public first: number = null,
    public skip: number = null,
    public order: { [key: string]: 'asc' | 'desc' } = null
  ) {}
}

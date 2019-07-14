export class ApiQuery {
  constructor(
    public filter: { [key: string]: string | RegExp } = null,
    public first: number = null,
    public skip: number = null,
    public order: { [key: string]: number } = null
  ) {}
}

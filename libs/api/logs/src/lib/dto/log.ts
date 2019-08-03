export class LogDto {
  constructor(
    public readonly userId: string,
    public readonly action: string,
    public readonly bookId: string
  ) {}
}

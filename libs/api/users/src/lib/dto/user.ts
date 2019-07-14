export class UserDto {
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly password?: string;
  readonly avatar?: string;
  readonly reading?: {
    epubUrl: string;
    bookmark?: string;
  };
}

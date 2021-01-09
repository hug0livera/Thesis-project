export class AuthenticationModel {
  constructor(
    public name: string,
    public email: string,
    public password: string,
    public gender: string,
    public role?: boolean,
    public observer?: boolean
  ) {}
}

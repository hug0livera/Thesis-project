export class UserModel {
  constructor(
    public id_user: number,
    public name: string,
    public email: string,
    public password: string,
    public gender: string,
    public observer: boolean,
    public invitation?: string,
    public message?: string,
    public administrator?: boolean,
    public active?: boolean,
    public invited_user?: boolean
  ) {}
}

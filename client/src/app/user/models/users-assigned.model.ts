export class UserAssignedModel {
  constructor(
    public task_name: string,
    public email: string,
    public post_annotated_in_total: number,
    public post_in_total: number,
    public day: number
  ) {}
}

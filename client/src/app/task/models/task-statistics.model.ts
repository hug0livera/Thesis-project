export class TaskStaticsModel {
  constructor(
    public id_task: number,
    public task_name: string,
    public count: number,
    public name: string,
    public email: string,
    public number_annotation: number,
    public day: number,
    public count_post: number,
    public number_post_annotation: number,
    public total_assigned_users: number,
    public post_intotal: number
  ) {}
}

export class TaskModel {
  constructor(
    public id_task: number,
    public task_name: string,
    public chance_value: number,
    public random_threshold: number,
    public task_description: string,
    public link_to_guidelines: string,

    public state?: string,
    public active?: boolean
  ) {}
}

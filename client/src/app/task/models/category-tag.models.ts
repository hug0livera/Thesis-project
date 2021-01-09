export class CategoryTagModel {
  constructor(
    public task_name: string,
    public task_description: string,
    public id_category: number,
    public tag_category_name: string,
    public tag_name: string,
    public color: string
  ) {}
}

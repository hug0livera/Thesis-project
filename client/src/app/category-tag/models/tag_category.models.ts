export class TagCategoryModel {
  constructor(
    public id_category: number,
    public id_task: number,
    public tag_category_name: string,
    public mandatory: boolean,
    public multi_choice: boolean,
    public index?: number
  ) {}
}

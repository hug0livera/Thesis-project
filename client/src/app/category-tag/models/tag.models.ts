export class TagModel {
  constructor(
    public id_tag: number,
    public id_category: number,
    public tag_name: string,
    public color: string,
    public behavior: number,
    public index?: number
  ) {}
}

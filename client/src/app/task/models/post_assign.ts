export class PostModel {
  constructor(
    public id_task: number,
    public task_name: string,
    public id_post: number,
    public uri: string,
    public text: string,
    public category: string,
    public image?: string,
    public image_path?: string
  ) {}

  get imageUrl() {
    if (this.image) {
      return `http://localhost:8888/image/116/image.PNG`;
    } else {
      return `http://localhost:8888/image/116/default.PNG`;
    }
  }
}

import { Component, OnInit, ElementRef } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import Swal from "sweetalert2";
import { TranslateService } from "@ngx-translate/core";
import { ViewChild } from "@angular/core";

//Model
import { TaskModel } from "../../models/tasks.models";
import { PostModel } from "../../models/post_assign";
//service
import { TasksService } from "../../services/task.service";
import { TaskUploadDownloadService } from "../../services/task-upload-download.service";

@Component({
  selector: "app-task-post",
  templateUrl: "./task-post.component.html",
  styleUrls: ["./task-post.component.css"],
})
export class TaskPostComponent implements OnInit {
  post: PostModel[] = [];
  task: TaskModel;
  seePost: boolean = true;
  pageActual: number = 1;
  count: number = 10;
  imgUrl = "";
  fileImages: File;
  id: number;
  @ViewChild("inputFile")
  inputFile: ElementRef;

  /**
   *
   * @param router
   * @param activatedRoute
   * @param taskService
   */
  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private taskService: TasksService,
    public translate: TranslateService,

    private UploadDownloadService: TaskUploadDownloadService
  ) {
    activatedRoute.params.subscribe((params) => {
      let id = params["id"];
      this.saveId(id);
    });
  }

  /**
   *
   */
  ngOnInit(): void {
    this.getAssignedTask();
  }

  /**
   *
   * @param id
   */
  saveId(id: number) {
    this.id = id;
  }

  /**
   *  Upload the file
   *
   */
  insertFile(file: File) {
    this.fileImages = file;
  }

  /**
   * Insertion of CSV data on the server
   *
   * @param task
   */
  uploadFile() {
    this.UploadDownloadService.uploadFileZip(this.id, this.fileImages).then((resp: any) => {
      this.inputFile.nativeElement.value = "";
      this.getAssignedTask();
    });
  }

  /**
   *
   * @param id
   */
  uploadImage() {
    this.UploadDownloadService.uploadImage(this.id).subscribe((resp: any) => {
      this.getAssignedTask();
    });
  }

  /**
   *
   * get a list of post assigned to the task
   *
   * @param id task key
   */
  getAssignedTask() {
    this.taskService.getPost(this.id).subscribe(
      (resp: any) => {
        this.post = resp;
      },
      (err) => console.log(err)
    );
  }

  /**
   *
   */
  listPost() {
    this.seePost = true;
  }

  /**
   *
   */
  cardPost() {
    this.seePost = false;
  }
}

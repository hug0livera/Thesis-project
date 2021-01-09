import { Component, OnInit, ElementRef } from "@angular/core";
import Swal from "sweetalert2";
import { TranslateService } from "@ngx-translate/core";
import { ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

//Model
import { TaskModel } from "../../models/tasks.models";
import { CategoryTagModel } from "../../models/category-tag.models";
//Service
import { TaskUploadDownloadService } from "../../services/task-upload-download.service";
import { TasksService } from "../../services/task.service";

@Component({
  selector: "app-tasks-edit",
  templateUrl: "./task-list.component.html",
  styleUrls: ["./task-list.component.css"],
})
export class TaskListComponent implements OnInit {
  /**
   *
   */
  categoryTag: CategoryTagModel[] = [];
  tasks: TaskModel[] = [];
  task: TaskModel;
  taskDownload: TaskModel;

  fileCsv: File;
  uploading: boolean = false;
  @ViewChild("inputFile")
  inputFile: ElementRef;

  /**
   *
   * @param taskService
   * @param UploadDownloadService
   */
  constructor(
    public router: Router,

    public translate: TranslateService,
    public activatedRoute: ActivatedRoute,

    public taskService: TasksService,
    private UploadDownloadService: TaskUploadDownloadService
  ) {}

  ngOnInit() {
    this.uploading = true;
    this.getTasks();
  }

  /**
   *  Upload the file
   */
  insertFile(file: File) {
    this.fileCsv = file;
  }

  /**
   *  Insertion of CSV data on the server
   *
   */
  uploadFile(task: TaskModel) {
    this.UploadDownloadService.uploadPost(task.id_task, this.fileCsv).then((resp: any) => {
      this.inputFile.nativeElement.value = "";
    });
  }

  /**
   *  get a list of all tasks
   *
   */
  getTasks() {
    this.taskService.getTasks().subscribe(
      (resp: any) => {
        this.tasks = resp;
        this.uploading = false;
      },
      (err) => console.log(err)
    );
  }

  /**
   *
   * Change the state of the task to inactive
   *
   * @param task
   */
  changeStateInactive(task: TaskModel) {
    this.taskService.changeStateInactive(task.id_task).subscribe((resp) => {
      this.getTasks();
    });
  }

  /**
   *
   *  Change the state of the task to active
   *
   *  @param task
   */
  changeStateActive(task: TaskModel) {
    this.taskService.changeStateActive(task.id_task).subscribe((resp) => {
      this.getTasks();
    });
  }

  /**
   *  delete the the selected task
   *
   *  @param task the task to be deleted
   *
   */
  deleteTask(task: TaskModel) {
    Swal.fire({
      title: this.translate.instant("message.task.areYouSureIWillEliminateTheTask"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: this.translate.instant("message.task.no"),
      confirmButtonText: this.translate.instant("message.task.yes"),
    }).then((result) => {
      if (result.value) {
        this.taskService.deleteTask(task.id_task).subscribe((resp) => {
          this.getTasks();
        });
        Swal.fire(
          this.translate.instant("message.task.deleted"),
          this.translate.instant("message.task.TheTaskHasBeenDeleted"),
          "success"
        );
      }
    });
  }

  /**
   *
   * Save the task key
   *
   * @param task
   *
   */
  saveIdTask(task: TaskModel) {
    this.taskDownload = task;
  }

  /**
   *
   * Download the annotations of the task
   *
   * @param task
   *
   */
  downloadAnnotation() {
    this.UploadDownloadService.downloadAnnotation(
      this.taskDownload.id_task,
      this.taskDownload.task_name + "-annotation"
    );
  }

  /**
   *
   * Download CSV file without annotations
   *
   * @param task
   *
   */
  downloadCSVFileWithoutAnnotations() {
    this.UploadDownloadService.downloadCSVFileWithoutAnnotations(
      this.taskDownload.id_task,
      this.taskDownload.task_name + "-post"
    );
  }

  /**
   *
   *  Change task status from under construction
   *  to finalized
   *
   *  @param id
   *
   */
  taskFinished(task: TaskModel) {
    this.taskService.finishTask(task.id_task).subscribe(
      (resp: any) => {
        this.getTasks();

        Swal.fire({
          icon: "success",
          title: this.translate.instant("message.task.TaskCompletedWithSuccess"),
        });
      },
      (err) => {
        Swal.fire({
          icon: "error",
          title: this.translate.instant("message.task.TheTaskMustHaveAtLeastOneCategory"),
          text: this.translate.instant("message.task.AllCategoriesOfTheTaskMustHaveAtLeastOneTag"),
        });
      }
    );
  }
}

import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import Swal from "sweetalert2";
import jwt_decode from "jwt-decode";

//Model
import { TaskModel } from "../../models/tasks.models";
import { TaskStaticsModel } from "../../models/task-statistics.model";
//Service
import { TasksService } from "../../services/task.service";
import { TaskUploadDownloadService } from "../../services/task-upload-download.service";
import { AuthService } from "../../../core/services/auth.service";

@Component({
  selector: "app-task-statistics",
  templateUrl: "./task-statistics.component.html",
  styleUrls: ["./task-statistics.component.css"],
})
export class TaskStatisticsComponent implements OnInit {
  constructor(
    public taskService: TasksService,
    private UploadDownloadService: TaskUploadDownloadService,
    public authService: AuthService
  ) {}
  tasks: TaskModel[] = [];
  task: TaskModel;
  taskStatics: TaskStaticsModel[] = [];
  taskDownload: TaskModel;

  /**
   *
   */
  ngOnInit(): void {
    this.gettaskStatistics();
  }

  /**
   *
   * Task list with its statistics
   *
   */
  gettaskStatistics() {
    this.taskService.gettaskStatistics().subscribe(
      (resp: any) => {
        this.taskStatics = resp;
      },
      (err) => console.log(err)
    );
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
   * Save the task key
   *
   * @param task
   *
   */
  saveIdTask(task: TaskModel) {
    this.taskDownload = task;
  }
}

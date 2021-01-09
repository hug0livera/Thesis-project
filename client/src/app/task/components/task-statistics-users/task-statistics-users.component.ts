import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

import { Router, ActivatedRoute } from "@angular/router";
//Model
import { UserModel } from "../../../user/models/users.model";
import { TaskStaticsModel } from "../../models/task-statistics.model";
import { TaskModel } from "../../models/tasks.models";

//Service
import { UsersService } from "../../../user/services/user.service";
import { TasksService } from "../../services/task.service";
import { AuthService } from "../../../core/services/auth.service";
@Component({
  selector: "app-task-statistics-users",
  templateUrl: "./task-statistics-users.component.html",
  styleUrls: ["./task-statistics-users.component.css"],
})
export class TaskStatisticsUsersComponent implements OnInit {
  taskStatics: TaskStaticsModel[] = [];
  task: TaskModel;

  /**
   *
   * @param router
   * @param activatedRoute
   * @param usersService
   * @param taskService
   */
  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public usersService: UsersService,
    public authService: AuthService,

    private taskService: TasksService,
    public translate: TranslateService
  ) {
    activatedRoute.params.subscribe((params) => {
      let id = params["id"];
      this.getTaskStatisticsAssignedUser(id);
      this.getNameTask(id);
    });
  }

  ngOnInit(): void {}

  /**
   *
   * @param id
   */
  getTaskStatisticsAssignedUser(id: number) {
    this.taskService.getTaskStatisticsAssignedUser(id).subscribe(
      (resp: any) => {
        this.taskStatics = resp;
      },
      (err) => console.log(err)
    );
  }

  /**
   *
   * Gets the name of the task
   *
   */

  getNameTask(id: number) {
    this.taskService.getNameTask(id).subscribe(
      (resp: any) => {
        this.task = resp;
      },
      (err) => {
        console.log(err);
      }
    );
  }
}

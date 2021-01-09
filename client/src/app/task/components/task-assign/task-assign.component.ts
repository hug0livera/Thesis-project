import { Component, OnInit } from "@angular/core";
import Swal from "sweetalert2";
import { TranslateService } from "@ngx-translate/core";
import { Router, ActivatedRoute } from "@angular/router";
//Model
import { UserModel } from "../../../user/models/users.model";
import { UserTask } from "../../models/users_task.models";
import { TaskModel } from "../../models/tasks.models";
//Service
import { TasksService } from "../../services/task.service";
import { UsersService } from "../../../user/services/user.service";

@Component({
  selector: "app-task-assign",
  templateUrl: "./task-assign.component.html",
  styleUrls: ["./task-assign.component.css"],
})
export class TaskAssignComponent implements OnInit {
  /**
   *
   */
  tasks: TaskModel[] = [];
  users: UserModel[] = [];
  usersAssignedToTask: UserModel[] = [];
  user: UserModel;

  userTask: UserTask;
  id: number;

  /**
   *
   * @param taskService
   * @param userService
   * @param translate
   * @param activatedRoute
   */
  constructor(
    public taskService: TasksService,
    public userService: UsersService,
    public translate: TranslateService,
    public activatedRoute: ActivatedRoute
  ) {
    activatedRoute.params.subscribe((params) => {
      let id = params["id"];
      this.getTasksActive(id);
      this.saveId(id);
    });
  }

  ngOnInit() {
    this.getUsers();
    this.usersAssignedToATask();
  }

  /**
   *
   * @param id
   */
  saveId(id: number) {
    this.id = id;
  }

  /**
   * Assign the task to a user
   *
   * @param t task key
   * @param u user key
   */
  assignTaskUser(t: number, u: number) {
    let task = new UserTask(t, u);
    this.taskService.assignTaskUser(task).subscribe(
      (resp) => {
        Swal.fire({
          icon: "success",
          title: this.translate.instant("message.task.taskAssignedSuccessfully"),
        });
        this.getUsers();
      },
      (err) => {
        Swal.fire({
          icon: "error",
          title: "error",
          text: err.error,
        });
      }
    );
  }

  /**
   *  Get the task
   *
   * @param id task key
   */
  getTasksActive(id: number) {
    this.taskService.getTasksActive(id).subscribe(
      (resp: any) => {
        this.tasks = resp;
      },
      (err) => console.log(err)
    );
  }

  /**
   *  Gets a list of users
   *
   */
  getUsers() {
    this.userService.usersNotAssignedTask(this.id).subscribe(
      (resp: any) => {
        this.users = resp;
        this.usersAssignedToATask();
      },
      (err) => console.log(err)
    );
  }

  /**
   *
   * Get all users assigned to a task
   *
   */ usersAssignedToATask() {
    this.taskService.usersAssignedToATask(this.id).subscribe(
      (resp: any) => {
        this.usersAssignedToTask = resp;
      },
      (err) => console.log(err)
    );
  }

  /**
   *
   * @param id
   */
  deactivateAssignTaskUser(user: UserModel) {
    this.taskService.deactivateAssignTaskUser(this.id, user).subscribe((resp: any) => {
      this.usersAssignedToATask();
    });
  }

  /**
   *
   * Delete the the selected task
   *
   * @param task the task to be deleted
   *
   */
  deleteTaskAssignment(idUser: number) {
    Swal.fire({
      title: this.translate.instant("message.task.areYouSureYouDeleteTheAssignment"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: this.translate.instant("message.task.no"),
      confirmButtonText: this.translate.instant("message.task.yes"),
    }).then((result) => {
      if (result.value) {
        this.taskService.deleteTaskAssignment(this.id, idUser).subscribe(
          (resp) => {
            this.getUsers();
            this.usersAssignedToATask();
            Swal.fire(
              this.translate.instant("message.task.deleted"),
              this.translate.instant("message.task.theAssignmentwascanceled"),
              "success"
            );
          },
          (error) => {
            Swal.fire({
              icon: "error",
              title: this.translate.instant("message.task.theAssignmentCannotBeDeleted"),
              text: this.translate.instant("message.task.TheUserHasAlreadyMadeSomeAnnotations"),
            });
          }
        );
      }
    });
  }
}

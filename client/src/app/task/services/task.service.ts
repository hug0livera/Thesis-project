import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import Swal from "sweetalert2";
import { Observable } from "rxjs/Observable";
import { TranslateService } from "@ngx-translate/core";
import { saveAs } from "file-saver";
//Model
import { PostModel } from "../models/post_assign";
import { TaskModel } from "../models/tasks.models";
import { UserTask } from "../models/users_task.models";
import { TagCategoryModel } from "../models/tag_category.models";
import { environment } from "../../../environments/environment";
import { UserModel } from "src/app/user/models/users.model";

@Injectable({
  providedIn: "root",
})
export class TasksService {
  public post: PostModel;
  private url = "";
  constructor(private http: HttpClient, public translate: TranslateService) {
    this.url = environment.url_server;
  }

  /**
   *
   */
  get token(): string {
    return localStorage.getItem("token") || "";
  }

  /**
   *
   */
  get headers() {
    return {
      headers: {
        "x-token": this.token,
      },
    };
  }

  /**
   *
   * Task creation
   *
   * @param task
   *
   */
  createTask(task: TaskModel) {
    return this.http.post(`${this.url}/create-task`, task, this.headers);
  }

  /**
   *
   * Delete the the selected task
   *
   * @param task the task to be deleted
   *
   */
  deleteTask(id: number) {
    let url = this.url + "/delete-task/" + id;
    return this.http.delete(url, this.headers);
  }

  /**
   *
   * Delete the the selected task
   *
   * @param task the task to be deleted
   *
   */
  deleteTaskAssignment(idTask: number, idUser: number) {
    let url = this.url + "/delete-taskAssignment/" + idTask + "/" + idUser;
    return this.http.delete(url, this.headers);
  }

  /**
   *
   *  Task edit
   *
   *  @param id
   *  @param task
   *
   */
  editTask(id: number, task: TaskModel) {
    return this.http.put(`${this.url}/edit-task/${id}`, task, this.headers);
  }

  /**
   *
   * Get all tasks
   *
   */
  getTasks() {
    const url = `${this.url}/tasks`;
    return this.http.get(url, this.headers);
  }

  /**
   *
   * Get all users assigned to a task
   *
   */
  usersAssignedToATask(id: number) {
    let url = this.url + "/task-users-assigned-to-a-task/" + id;
    return this.http.get(url, this.headers);
  }

  /**
   *
   * Get one task
   *
   */
  getOneTask(id: number) {
    let url = this.url + "/task/" + id;
    return this.http.get(url, this.headers);
  }

  /**
   *
   *  Get a list of task under construction
   *
   */
  getTasksConstruction() {
    let url = this.url + "/task-construction";
    return this.http.get(url, this.headers);
  }

  /**
   *
   * Change the state of the task to inactive
   *
   * @param id
   *
   */
  changeStateInactive(id: number) {
    let url = this.url + "/changeStateInactive-task/" + id;
    return this.http.put(url, null, this.headers);
  }

  /**
   *
   * Change the state of the task to active
   *
   * @param id
   */
  changeStateActive(id: number) {
    let url = this.url + "/changeStateActive-task/" + id;
    return this.http.put(url, null, this.headers);
  }

  /**
   *
   *  Change task status from under construction
   *  to finalized
   *
   *  @param id
   *
   */
  finishTask(id: number) {
    let url = this.url + "/task-finish/" + id;
    return this.http.put(url, null, this.headers);
  }

  /**
   *
   * Get the task
   *
   * @param id task key
   *
   */
  getTasksActive(id: number) {
    let url = this.url + "/task/" + id;
    return this.http.get(url, this.headers);
  }

  /**
   *
   * get a list of post assigned to the task
   *
   * @param id task key
   *
   */
  getPost(id: number) {
    let url = this.url + "/post/" + id;
    return this.http.get(url, this.headers);
  }

  /**
   *
   * Task list with its statistics
   *
   */
  gettaskStatistics() {
    let url = this.url + "/tasks-statistics";
    return this.http.get(url, this.headers);
  }

  /**
   *
   * Task list and users with its statistics
   *
   */
  getTaskStatisticsAssignedUser(id: number) {
    let url = this.url + "/tasks-assignedUser/" + id;
    return this.http.get(url, this.headers);
  }

  /**
   *
   * Assign the task to a user
   *
   * @param t task key
   * @param u user key
   *
   */
  assignTaskUser(userTask: UserTask) {
    return this.http.post(`${this.url}/task-assign/`, userTask, this.headers);
  }

  /**
   *
   * Gets the name of the task
   *
   * @param id
   *
   */
  getNameTask(id: number) {
    let url = this.url + "/tasks-name/" + id;
    return this.http.get(url, this.headers);
  }

  /**
   *
   */
  deactivateAssignTaskUser(idTask: number, user: UserModel) {
    let url = this.url + "/task-assignment-disable/" + idTask;
    return this.http.put(url, user, this.headers);
  }
}

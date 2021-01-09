import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, delay } from "rxjs/operators";
import Swal from "sweetalert2";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import { Observable } from "rxjs/Observable";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { environment } from "../../../environments/environment";
import { UserModel } from "../models/users.model";

@Injectable({
  providedIn: "root",
})
export class UsersService {
  private url = "";

  constructor(public http: HttpClient, public router: Router, public translate: TranslateService) {
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
   * User creation
   *
   * @param user
   *
   */
  createUser(user: UserModel) {
    return this.http.post(`${this.url}/create-user`, user, this.headers);
  }

  /**
   *
   * Get a list of users
   *
   */
  getUsers() {
    let url = this.url + "/users";
    return this.http.get(url, this.headers);
  }

  /**
   *
   * List of users not assigned to a task
   *
   */
  usersNotAssignedTask(id: number) {
    let url = this.url + "/user-assigned-task/" + id;
    return this.http.get(url, this.headers);
  }

  /**
   *  Get a list of users with its statistics
   *
   */
  getUsersStatistics() {
    let url = this.url + "/user-statistics/";
    return this.http.get(url, this.headers);
  }

  /**
   * Gets a list of the tasks assigned to the user
   * (It is for statistics)
   * @param id
   */
  getAssignedTask(id: number) {
    let url = this.url + "/user-statistics/" + id;
    return this.http.get(url, this.headers);
  }

  /**
   * Gets the name of the user
   * @param id user key
   */
  nameUserTaskAssigned(id: number) {
    let url = this.url + "/user-assignedTasks/" + id;
    return this.http.get(url, this.headers);
  }

  /**
   *  Generate a password
   *
   */
  generatePassword() {
    let url = this.url + "/user-generate";
    return this.http.get(url, this.headers);
  }

  /**
   *
   * Invite a user to use the platform
   *
   *  @param user
   *
   */
  inviteUser(user: UserModel) {
    let url = this.url + "/user-invite";
    return this.http.post(url, user, this.headers);
  }

  /**
   *
   *
   *
   *  @param id
   *  @param task
   *
   */
  updateRole(id: number) {
    let url = this.url + "/user-role/" + id;
    return this.http.put(url, null, this.headers);
  }

  /**
   *
   */
  authenticationTelegram(mail: string) {
    let url = this.url + "/user-codeTelegram/" + mail;
    return this.http.get(url, this.headers);
  }

  /**
   *
   *  Task edit
   *
   *  @param id
   *  @param day
   *
   */
  reminderDay(mail: string, day: number) {
    let url = this.url + "/user-reminder-day/" + mail + "/" + day;
    return this.http.put(url, null, this.headers);
  }

  /**
   *
   *
   *
   *  @param id
   *  @param task
   *
   */
  deleteUser(id: number) {
    let url = this.url + "/delete-user/" + id;
    return this.http.put(url, null, this.headers);
  }

  /**
   *
   *
   *
   *  @param id
   *  @param task
   *
   */
  updateUser(user: UserModel, id: number) {
    let url = this.url + "/update-user/" + id;
    return this.http.put(url, user, this.headers);
  }

  /**
   *
   */
  getUser(id: number) {
    let url = this.url + "/user/" + id;
    return this.http.get(url, this.headers);
  }

  /**
   *
   *
   *
   *  @param id
   *  @param task
   *
   */
  generateNewPassword(id: number, user: UserModel) {
    let url = this.url + "/user-newPassword/" + id;
    return this.http.put(url, user, this.headers);
  }
}

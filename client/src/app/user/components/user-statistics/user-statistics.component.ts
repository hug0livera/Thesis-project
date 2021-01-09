import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

//Model
import { UserModel } from "../../models/users.model";
import { TaskModel } from "../../../task/models/tasks.models";
import { UserStatistics } from "../../models/users-statistics.model";
import { UserTask } from "../../../task/models/users_task.models";
//Service
import { UsersService } from "../../services/user.service";
import { AuthService } from "../../../core/services/auth.service";
@Component({
  selector: "app-user-statistics",
  templateUrl: "./user-statistics.component.html",
  styleUrls: ["./user-statistics.component.css"],
})
export class UsersStatisticsComponent implements OnInit {
  users: UserModel[] = [];
  tasks: TaskModel[] = [];
  usersStatistics: UserStatistics[] = [];

  constructor(
    public authService: AuthService,
    public userService: UsersService,
    public translate: TranslateService
  ) {}

  ngOnInit() {
    this.getUsersStatistics();
  }

  /**
   *  Get a list of users with its statistics
   *
   */
  getUsersStatistics() {
    this.userService.getUsersStatistics().subscribe(
      (resp: any) => {
        this.usersStatistics = resp;
      },
      (err) => console.log(err)
    );
  }
}

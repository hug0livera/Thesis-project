import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { TranslateService } from "@ngx-translate/core";

//Model
import { TaskModel } from "../../../task/models/tasks.models";
import { UserModel } from "../../models/users.model";
//Service
import { UsersService } from "../../services/user.service";
import { UserAssignedModel } from "../../models/users-assigned.model";
import { AuthService } from "../../../core/services/auth.service";

@Component({
  selector: "app-user-statistics-task",
  templateUrl: "./user-statistics-task.component.html",
  styleUrls: ["./user-statistics-task.component.css"],
})
export class UserStatisticsTaskComponent implements OnInit {
  tasks: TaskModel[] = [];
  user: UserModel;
  statistics: UserAssignedModel[] = [];
  /**
   *
   * @param router
   * @param activatedRoute
   * @param usersService
   */
  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private usersService: UsersService,
    public translate: TranslateService,
    public authService: AuthService
  ) {
    activatedRoute.params.subscribe((params) => {
      let id = params["id"];
      this.getAssignedTask(id);
      this.getnameUserTaskAssigned(id);
    });
  }

  ngOnInit(): void {}

  /**
   * Gets a list of the tasks assigned to the user
   * (It is for statistics)
   * @param id
   */
  getAssignedTask(id: number) {
    this.usersService.getAssignedTask(id).subscribe(
      (resp: any) => {
        this.statistics = resp;
      },
      (err) => console.log(err)
    );
  }

  /**
   * Gets the name of the user
   * @param id user key
   */
  getnameUserTaskAssigned(id: number) {
    this.usersService.nameUserTaskAssigned(id).subscribe(
      (resp: any) => {
        this.user = resp;
      },
      (err) => console.log(err)
    );
  }
}

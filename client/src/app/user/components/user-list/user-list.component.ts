import { Component, OnInit } from "@angular/core";
import Swal from "sweetalert2";
import { TranslateService } from "@ngx-translate/core";

//Model
import { UserModel } from "../../models/users.model";
//Service
import { UsersService } from "../../services/user.service";

@Component({
  selector: "app-user-list",
  templateUrl: "./user-list.component.html",
  styleUrls: ["./user-list.component.css"],
})
export class UsersListComponent implements OnInit {
  users: UserModel[] = [];

  constructor(public userService: UsersService, public translate: TranslateService) {}

  ngOnInit(): void {
    this.getUsers();
  }

  /**
   *
   *  Get a list of users
   *
   */
  getUsers() {
    this.userService.getUsers().subscribe(
      (resp: any) => {
        this.users = resp;
      },
      (err) => console.log(err)
    );
  }

  /**
   *  delete the the selected task
   *
   *  @param task the task to be deleted
   *
   */
  deleteUser(id: number) {
    Swal.fire({
      title: this.translate.instant("message.user.youAreSureToDeleteTheUser"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: this.translate.instant("message.task.no"),
      confirmButtonText: this.translate.instant("message.task.yes"),
    }).then((result) => {
      if (result.value) {
        this.userService.deleteUser(id).subscribe((resp: any) => {
          this.getUsers();
          Swal.fire({
            icon: "success",
            title: this.translate.instant("message.user.userDeleted"),
          });
        });
      }
    });
  }

  /**
   *  Generate a password
   *
   */
  generateNewPassword(id: number, user: UserModel) {
    Swal.fire({
      title: this.translate.instant("message.task.areYouSureToChangeTheUserPassword"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: this.translate.instant("message.task.no"),
      confirmButtonText: this.translate.instant("message.task.yes"),
    }).then((result) => {
      if (result.value) {
        let userModel = new UserModel(
          null,
          user.name,
          user.email,
          null,
          user.gender,
          user.observer,
          this.translate.instant("user.createUser.invitationToUseThePlatform"),
          this.translate.instant("user.createUser.yourCredentialsToAccessThePlatformAre")
        );
        this.userService.generateNewPassword(id, userModel).subscribe(
          (resp: any) => {
            Swal.fire({
              icon: "success",
              title: this.translate.instant("message.user.thePasswordHasBeenChanged"),
              text: this.translate.instant("message.user.hasBeenNotifiedToTheUserViaHisEmail"),
            });
          },
          (err) => {
            Swal.fire({
              icon: "error",
              //title: err.error,
              title: this.translate.instant("user.userList.thePasswordCouldNotBeChanged"),
            });
          }
        );
      }
    });
  }
}

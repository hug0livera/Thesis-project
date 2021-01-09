import { Component, OnInit } from "@angular/core";
import { NgForm, FormGroup, FormControl, Validators } from "@angular/forms";
import Swal from "sweetalert2";
import { TranslateService } from "@ngx-translate/core";
import { UsersService } from "../../services/user.service";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"],
})
export class UserProfileComponent implements OnInit {
  code: number;
  days: number;
  form: FormGroup;
  /**
   *
   * @param usersService
   * @param translate
   */
  constructor(public usersService: UsersService, public translate: TranslateService) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      code: new FormControl(),

      days: new FormControl(null, [Validators.required]),
    });
    this.authenticationTelegram();
  }

  /**
   *  Generate a password
   *
   */
  authenticationTelegram() {
    this.usersService
      .authenticationTelegram(localStorage.getItem("mail"))
      .subscribe((resp: any) => {
        this.form.setValue({
          code: resp.id_telegram,
          days: resp.day_reminder,
        });
      });
  }

  reminderDay() {
    this.usersService
      .reminderDay(localStorage.getItem("mail"), this.form.value.days)
      .subscribe((resp: any) => {
        Swal.fire({
          icon: "success",
          title: this.translate.instant("user.userList.successfullyUpdated"),
        });
      });
  }
}

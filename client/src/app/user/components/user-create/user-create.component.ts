import { Component, OnInit } from "@angular/core";
import { NgForm, FormGroup, FormControl, Validators } from "@angular/forms";
import { Observable } from "rxjs/Observable";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
//Model
import { UserModel } from "../../models/users.model";
//Service
import { UsersService } from "../../services/user.service";

@Component({
  selector: "app-user-create",
  templateUrl: "./user-create.component.html",
  styleUrls: ["./user-create.component.css"],
})
export class UserCreateComponent implements OnInit {
  users: UserModel[] = [];
  form: FormGroup;

  /**
   *
   * @param usersService
   * @param translate
   */
  constructor(private usersService: UsersService, public translate: TranslateService) {}

  /**
   *  Initializes the form
   *
   */
  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      gender: new FormControl(null, [Validators.required]),
      observer: new FormControl(null, [Validators.required]),
    });
  }

  /**
   *
   * User creation
   *
   * @param user
   *
   */
  createUser() {
    if (this.form.invalid) return;
    let user = new UserModel(
      null,
      this.form.value.name,
      this.form.value.email,
      this.form.value.password,
      this.form.value.gender,
      this.form.value.observer,
      this.translate.instant("user.createUser.invitationToUseThePlatform"),
      this.translate.instant("user.createUser.yourCredentialsToAccessThePlatformAre")
    );

    this.usersService.createUser(user).subscribe(
      (resp: any) => {
        this.form.reset();
        Swal.fire({
          icon: "success",
          title: this.translate.instant("user.userList.createNewUser"),
          text: this.translate.instant("user.createUser.theUserHasBeenInvitedByEmail"),
        });
      },
      (err) => {
        this.form.reset();
        Swal.fire({
          icon: "error",
          title: this.translate.instant("user.createUser.TheUserWasNotCreatedSuccessfully"),
          text: this.translate.instant("user.userList.theUserAlreadyExists"),
          //title: this.translate.instant("user.userList.theUserAlreadyExists"),

          // text: JSON.stringify(err.error),
        });
      }
    );
  }

  /**
   *  Generate a password
   *
   */
  generatePassword() {
    this.usersService.generatePassword().subscribe((resp: any) => {
      this.form.patchValue({
        password: resp,
      });
    });
  }
}

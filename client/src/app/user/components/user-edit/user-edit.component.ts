import { Component, OnInit } from "@angular/core";
import { NgForm, FormGroup, FormControl, Validators } from "@angular/forms";
import { Observable } from "rxjs/Observable";
import Swal from "sweetalert2";
import { Router, ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
//Model
import { UserModel } from "../../models/users.model";
//Service
import { UsersService } from "../../services/user.service";

@Component({
  selector: "app-user-edit",
  templateUrl: "./user-edit.component.html",
  styleUrls: ["./user-edit.component.css"],
})
export class UserEditComponent implements OnInit {
  users: UserModel[] = [];
  form: FormGroup;

  /**
   *
   * @param usersService
   * @param translate
   */
  constructor(
    private usersService: UsersService,
    public translate: TranslateService,
    public activatedRoute: ActivatedRoute
  ) {
    activatedRoute.params.subscribe((params) => {
      let id = params["id"];
      this.loadCategory(id);
    });
  }

  /**
   *  Initializes the form
   *
   */
  ngOnInit(): void {
    this.form = new FormGroup({
      id_user: new FormControl(null),
      name: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null),
      gender: new FormControl(null, [Validators.required]),
      observer: new FormControl(null),
    });
  }

  /**
   *
   * Upload category values to the form
   * @param id
   *
   */
  loadCategory(id: number) {
    this.usersService.getUser(id).subscribe(
      (resp: any) => {
        const { id_user, name, email, gender, observer } = resp[0];

        this.form.patchValue({
          id_user: id_user,
          name: name,
          email: email,
          gender: gender,
          observer: observer,
        });
      },
      (err) => console.log(err)
    );
  }

  /**
   *
   * update user
   *
   * @param user
   *
   */
  updateUser() {
    if (this.form.invalid) return;
    let user = new UserModel(
      null,
      this.form.value.name,
      this.form.value.email,
      this.form.value.password,
      this.form.value.gender,
      this.form.value.observer
    );

    this.usersService.updateUser(user, this.form.value.id_user).subscribe(
      (resp: any) => {
        Swal.fire({
          icon: "success",
          title: this.translate.instant("message.user.userUpdatedSuccessfully"),
        });
      },
      (err) => {
        this.form.reset();
        Swal.fire("Error", err.error, "error");
      }
    );
  }
}

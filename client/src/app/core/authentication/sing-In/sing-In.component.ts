import { Component, OnInit } from "@angular/core";
import { AuthenticationModel } from "../../models/authentication.model";
import { NgForm } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./sing-In.component.html",
  styleUrls: ["./sing-In.component.css"],
  styles: [],
})
export class LoginComponent implements OnInit {
  utente: AuthenticationModel;
  admin;
  constructor(public authService: AuthService, public router: Router) {}

  ngOnInit(): void {}

  /**
   *
   * @param form
   */
  login(form: NgForm) {
    if (form.invalid) return;
    localStorage.setItem("mail", form.value.email);
    let user = new AuthenticationModel(null, form.value.email, form.value.password, null);
    this.authService.login(user).subscribe((correct) => {
      this.authService.idAdmin(form.value.email).subscribe((data) => {
        //localStorage.setItem("ad", data.admin[0].administrator);
        // this.authService.admin= localStorage.getItem('admin');
        if (data.admin[0].administrator == true) {
          this.router.navigate(["/task"]);
        } else {
          this.router.navigate(["/home"]);
        }
      });
    });
  }
}

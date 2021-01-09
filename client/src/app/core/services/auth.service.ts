import { Injectable } from "@angular/core";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { AuthenticationModel } from "../models/authentication.model";
import Swal from "sweetalert2";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import { Observable, of } from "rxjs";
import { throwError } from "rxjs";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { environment } from "../../../environments/environment";
import { tap, map, catchError } from "rxjs/operators";
import { UserModel } from "src/app/user/models/users.model";
import jwt_decode from "jwt-decode";
@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(public http: HttpClient, public router: Router, public translate: TranslateService) {
    this.url = environment.url_server;
  }
  private url = "";
  user: AuthenticationModel;

  /**
   *
   */
  get token(): string {
    return localStorage.getItem("token") || "";
  }

  /**
   *
   */
  get adminRole(): boolean {
    let decoded = jwt_decode(localStorage.getItem("token"));
    return decoded.a;
  }

  /**
   *
   */
  get observer(): boolean {
    let decoded = jwt_decode(localStorage.getItem("token"));
    return decoded.o;
  }

  /**
   *
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
   *  renew the token
   *
   */
  public validateToken(): Observable<boolean> {
    const token = localStorage.getItem("token") || " ";
    return this.http
      .get(`${this.url}/renew`, {
        headers: {
          "x-token": this.token,
        },
      })
      .pipe(
        map((resp: any) => {
          localStorage.setItem("token", resp.token);

          return true;
        }),
        catchError((error) => of(false))
      );
  }

  /**
   *
   */
  isLogged() {
    return this.token.length > 5 ? true : false;
  }

  /**
   *
   * @param user
   */
  login(user: AuthenticationModel) {
    localStorage.setItem("mail", user.email);
    return this.http
      .post(`${this.url}/singIn`, user)
      .pipe(
        tap((resp: any) => {
          localStorage.setItem("token", resp.token);
        })
      )
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Errore",
          text: "The mail or password is wrong ",
        });
        return Observable.throw(err);
      });
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("mail");
    this.router.navigateByUrl("./login");
  }

  giveToken() {
    if (localStorage.getItem("token")) return localStorage.getItem("token");
    else return null;
  }

  getUserInfo() {
    return localStorage.getItem("mail");
  }

  idAdmin(email) {
    return this.http.post<any>(this.url + "/isAdmin", { mail: email }, this.headers);
  }
}

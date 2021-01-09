import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
import jwt_decode from "jwt-decode";

@Injectable({
  providedIn: "root",
})
export class AdminGuard implements CanActivate {
  constructor(public authService: AuthService, public router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let decoded = jwt_decode(localStorage.getItem("token"));
    if (decoded.a) {
      return true;
    } else {
      this.router.navigateByUrl("/user-annotation");
      return false;
    }
  }
}

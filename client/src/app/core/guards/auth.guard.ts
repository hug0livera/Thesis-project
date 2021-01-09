import { Injectable } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { TranslateService } from "@ngx-translate/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { tap, map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  value: boolean = false;
  constructor(
    public authService: AuthService,
    public router: Router,
    public translate: TranslateService
  ) {}
  /**
   *  Se non ha il token, esce del sito
   */
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.authService.validateToken().pipe(
      tap((isAuthenticated) => {
        if (!isAuthenticated) {
          this.value = false;

          Swal.fire({
            icon: "error",
            title: "Error",
            text: this.translate.instant("guard.access"),
          });
          localStorage.removeItem("ad");
          this.router.navigateByUrl("/login");
        } else {
          this.value = true;
        }
      })
    );
  }
}

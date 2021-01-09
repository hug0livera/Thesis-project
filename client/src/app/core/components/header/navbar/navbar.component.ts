import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../../services/auth.service";
import { TranslateService } from "@ngx-translate/core";
import { AuthGuard } from "../../../guards/auth.guard";
import { tap, map } from "rxjs/operators";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent implements OnInit {
  title = "client";

  constructor(
    public authService: AuthService,
    public translate: TranslateService,
    public guards: AuthGuard
  ) {
    this.translate.addLangs(["it", "en"]);
    this.translate.setDefaultLang("it");
  }
  ngOnInit(): void {
    //this.guards.value;
  }

  /**
   *
   */
  lenguageEnglish() {
    this.translate.use("en");
  }

  /***
   *
   */
  lenguageItalian() {
    this.translate.use("it");
  }

  /**
   *
   */
  logout() {
    localStorage.removeItem('ad');
    this.authService.logout();
  }
}

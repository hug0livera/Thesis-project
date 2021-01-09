import { BrowserModule } from "@angular/platform-browser";
import { ColorPickerModule } from "ngx-color-picker";
import { NgxPaginationModule } from "ngx-pagination";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MatButtonToggleModule } from "@angular/material/button-toggle";

/* import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator"; */

//translate
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "../assets/i18n/", ".json");
}
/* ======================== services =================================================================*/
//import { AdminGuard } from "./core/guards/admin.guard";

/* ======================== routes ====================================================================*/
import { APP_ROUTING } from "./app-routing.module";

/* ======================== components ================================================================*/
/* components core*/
import { AppComponent } from "./app.component";
import { NavbarComponent } from "./core/components/header/navbar/navbar.component";
import { FooterComponent } from "./core/components/footer/footer.component";
import { LoginComponent } from "./core/authentication/sing-In/sing-In.component";

/* components users*/
import { UserCreateComponent } from "./user/components/user-create/user-create.component";
import { UsersListComponent } from "./user/components/user-list/user-list.component";
import { UsersStatisticsComponent } from "./user/components/user-statistics/user-statistics.component";
import { UserStatisticsTaskComponent } from "./user/components/user-statistics-task/user-statistics-task.component";

/* components tasks*/
import { TaskAssignComponent } from "./task/components/task-assign/task-assign.component";
import { TaskCreateComponent } from "./task/components/task-create/task-create.component";
import { TaskGetCategoriesTagsComponent } from "./task/components/task-get-categories-tags/task-get-categories-tags.component";
import { TaskListComponent } from "./task/components/task-list/task-list.component";
import { TaskPostComponent } from "./task/components/task-post/task-post.component";
import { TaskStatisticsComponent } from "./task/components/task-statistics/task-statistics.component";
import { TaskStatisticsUsersComponent } from "./task/components/task-statistics-users/task-statistics-users.component";
import { TaskEditComponent } from "./task/components/task-edit/task-edit.component";

/* components categories*/
import { CategoryCreateComponent } from "./category-tag/components/category-create/category-create.component";
import { CategoryEditComponent } from "./category-tag/components/category-edit/category-edit.component";

/* components tags*/
import { TagCreateComponent } from "./category-tag/components/tag-create/tag-create.component";
import { TagEditComponent } from "./category-tag/components/tag-edit/tag-edit.component";
import { UserProfileComponent } from "./user/components/user-profile/user-profile.component";
import { NavbarObserverComponent } from "./core/components/header/navbar-observer/navbar-observer.component";
import { NavbarLoginComponent } from "./core/components/header/navbar-login/navbar-login.component";
import { TaskFinalizeComponent } from "./task/components/task-finalize/task-finalize.component";
import { UserEditComponent } from "./user/components/user-edit/user-edit.component";

@NgModule({
  declarations: [
    AppComponent,
    /* core */
    NavbarComponent,
    FooterComponent,
    LoginComponent,

    /* users */
    UserCreateComponent,
    UsersListComponent,
    UsersStatisticsComponent,
    UserStatisticsTaskComponent,

    /* tasks */
    TaskAssignComponent,
    TaskCreateComponent,
    TaskGetCategoriesTagsComponent,
    TaskListComponent,
    TaskPostComponent,
    TaskStatisticsComponent,
    TaskStatisticsUsersComponent,
    TaskEditComponent,

    /* categories */
    CategoryCreateComponent,
    CategoryEditComponent,

    /* tags */
    TagCreateComponent,
    TagEditComponent,
    UserProfileComponent,
    NavbarObserverComponent,
    NavbarLoginComponent,
    TaskFinalizeComponent,
    UserEditComponent,
  ],
  imports: [
    //MatPaginatorModule,
    DragDropModule,
    MatButtonToggleModule,
    //MatTableModule,
    BrowserModule,
    ColorPickerModule,
    NgxPaginationModule,
    APP_ROUTING,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

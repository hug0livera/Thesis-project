import { NgModule, Component } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

/* core */
import { LoginComponent } from "./core/authentication/sing-In/sing-In.component";

/* components users*/
import { UserCreateComponent } from "./user/components/user-create/user-create.component";
import { UsersListComponent } from "./user/components/user-list/user-list.component";
import { UsersStatisticsComponent } from "./user/components/user-statistics/user-statistics.component";
import { UserStatisticsTaskComponent } from "./user/components/user-statistics-task/user-statistics-task.component";
import { UserProfileComponent } from "./user/components/user-profile/user-profile.component";
import { UserEditComponent } from "./user/components/user-edit/user-edit.component";

/* task */
import { TaskAssignComponent } from "./task/components/task-assign/task-assign.component";
import { TaskCreateComponent } from "./task/components/task-create/task-create.component";
import { TaskGetCategoriesTagsComponent } from "./task/components/task-get-categories-tags/task-get-categories-tags.component";
import { TaskListComponent } from "./task/components/task-list/task-list.component";
import { TaskPostComponent } from "./task/components/task-post/task-post.component";
import { TaskStatisticsComponent } from "./task/components/task-statistics/task-statistics.component";
import { TaskStatisticsUsersComponent } from "./task/components/task-statistics-users/task-statistics-users.component";
import { TaskEditComponent } from "./task/components/task-edit/task-edit.component";
import { TaskFinalizeComponent } from "./task/components/task-finalize/task-finalize.component";

/* components categories*/
import { CategoryCreateComponent } from "./category-tag/components/category-create/category-create.component";
import { CategoryEditComponent } from "./category-tag/components/category-edit/category-edit.component";

/* components tags*/
import { TagCreateComponent } from "./category-tag/components/tag-create/tag-create.component";
import { TagEditComponent } from "./category-tag/components/tag-edit/tag-edit.component";

/*guard */
import { AuthGuard } from "./core/guards/auth.guard";
import { AdminGuard } from "./core/guards/admin.guard";
import { ObserverGuard } from "./core/guards/observer.guard";

const APP_ROUTES: Routes = [
  /* core */
  { path: "login", component: LoginComponent },

  /* users */
  {
    path: "user-edit/:id",
    component: UserEditComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: "user-create",
    component: UserCreateComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: "user-profile",
    component: UserProfileComponent,
    canActivate: [AuthGuard, AdminGuard],
  },

  {
    path: "user",
    component: UsersListComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: "user-statistics",
    component: UsersStatisticsComponent,
    canActivate: [AuthGuard, ObserverGuard],
  },
  {
    path: "user-statistics-task/:id",
    component: UserStatisticsTaskComponent,
    canActivate: [AuthGuard, ObserverGuard],
  },

  /* task */

  {
    path: "task-finalize/:id",
    component: TaskFinalizeComponent,
    canActivate: [AuthGuard, ObserverGuard],
  },

  {
    path: "task-statistics",
    component: TaskStatisticsComponent,
    canActivate: [AuthGuard, ObserverGuard],
  },
  {
    path: "task-statistics-users/:id",
    component: TaskStatisticsUsersComponent,
    canActivate: [AuthGuard, ObserverGuard],
  },
  {
    path: "task-create",
    component: TaskCreateComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: "task-edit/:id",
    component: TaskEditComponent,
    canActivate: [AuthGuard, AdminGuard],
  },

  {
    path: "task-assign/:id",
    component: TaskAssignComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: "task",
    component: TaskListComponent,
    canActivate: [AuthGuard, AdminGuard],
  },

  {
    path: "task-post/:id",
    component: TaskPostComponent,
    canActivate: [AuthGuard, AdminGuard],
  },

  {
    path: "task-category/:id",
    component: TaskGetCategoriesTagsComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  /* categories */
  {
    path: "create-category/:id",
    component: CategoryCreateComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: "category-edit/:id",
    component: CategoryEditComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: "category-edit/:idTask/:idCategory",
    component: CategoryEditComponent,
    canActivate: [AuthGuard, AdminGuard],
  },

  /* tag */
  {
    path: "create-tag/:id",
    component: TagCreateComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: "create-tag/:id/:task",
    component: TagCreateComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: "tag-edit/:id",
    component: TagEditComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: "tag-edit/:idTask/:idCategory/:idTag",
    component: TagEditComponent,
    canActivate: [AuthGuard, AdminGuard],
  },

  /* default */
  {
    path: "**",
    pathMatch: "full",
    redirectTo: "login",
  },
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES, { useHash: true });

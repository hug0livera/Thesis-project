import { Component, OnInit } from "@angular/core";
import Swal from "sweetalert2";
import { TranslateService } from "@ngx-translate/core";
import { Router, ActivatedRoute } from "@angular/router";
//Model
import { CategoryTagModel } from "../../models/category-tag.models";
//Service
import { TasksService } from "../../services/task.service";
import { CategoriesService } from "../../../category-tag/services/category.service";

@Component({
  selector: "app-task-get-categories-tags",
  templateUrl: "./task-get-categories-tags.component.html",
  styleUrls: ["./task-get-categories-tags.component.css"],
})
export class TaskGetCategoriesTagsComponent implements OnInit {
  categoryTag: CategoryTagModel[] = [];

  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private taskService: TasksService,
    private categoryService: CategoriesService,
    public translate: TranslateService
  ) {
    // id  === task key
    activatedRoute.params.subscribe((params) => {
      let id = params["id"];
      this.getCategoryTag(id);
    });
  }

  ngOnInit(): void {}

  /**
   * get the categories and tags of a task
   * @param id  task key
   */
  getCategoryTag(id: number) {
    this.categoryService.getCategoryTags(id).subscribe(
      (resp: any) => {
        this.categoryTag = resp;
      },
      (err) => console.log(err)
    );
  }
}

import { Component, OnInit } from "@angular/core";
import { NgForm, FormGroup, FormBuilder, FormControl, Validators, FormArray } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import Swal from "sweetalert2";
import { TranslateService } from "@ngx-translate/core";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
//Model
import { TaskModel } from "../../../task/models/tasks.models";
import { TagModel } from "../../models/tag.models";
import { TagCategoryModel } from "../../models/tag_category.models";

//Service
import { CategoriesService } from "../../services/category.service";
import { TasksService } from "../../../task/services/task.service";
import { TagsService } from "../../services/tag.service";

@Component({
  selector: "app-category-create",
  templateUrl: "./category-create.component.html",
  styleUrls: ["./category-create.component.css"],
})
export class CategoryCreateComponent implements OnInit {
  categories: TagCategoryModel[] = [];
  category: TagCategoryModel[] = [];
  tasks: TaskModel;
  tags: TagModel[] = [];
  id: number;

  /**
   *
   */
  constructor(
    public router: Router,
    private taskService: TasksService,
    private categoryService: CategoriesService,
    private formBuilder: FormBuilder,
    public translate: TranslateService,
    public activatedRoute: ActivatedRoute,
    public tagService: TagsService
  ) {
    activatedRoute.params.subscribe((params) => {
      let id = params["id"];
      this.saveId(id);
    });
    this.createFormCategory();
  }

  formCategory: FormGroup;
  formTag: FormGroup;

  ngOnInit() {
    this.getNameTask();
    this.getCategoryTag();
  }

  /**
   *  Creation of categories
   *
   */
  createCategory() {
    if (this.formCategory.invalid) return;
    let categoryTag = new TagCategoryModel(
      this.formCategory.value.id_category,
      this.id,
      this.formCategory.value.tag_category_name,
      this.formCategory.value.mandatory,
      this.formCategory.value.multi_choice
    );
    this.categoryService.createCategory(categoryTag).subscribe(
      (resp: any) => {
        Swal.fire({
          icon: "success",
          title: this.translate.instant("message.category.categorySuccessfullyAdded"),
        });
        this.updateIndex();
        //this.getCategoryTag();
        this.formCategory.reset();
      },
      (err) => {
        Swal.fire({
          icon: "error",
          title: this.translate.instant("message.category.TheCategoryNameExists"),
          text: this.translate.instant("message.category.CreateTheCategoryWithAnotherName"),
        });
      }
    );
  }

  /**
   *
   * Gets the name of the task
   *
   * @param id
   *
   */
  getNameTask() {
    this.taskService.getNameTask(this.id).subscribe(
      (resp: any) => {
        this.tasks = resp;
      },
      (err) => console.log(err)
    );
  }

  /**
   * get the categories  of a task
   * @param id  task key
   */
  getCategoryTag() {
    this.categoryService.getAllCategories(this.id).subscribe(
      (resp: any) => {
        this.categories = resp;
      },
      (err) => console.log(err)
    );
  }

  /**
   *
   * Save the task key
   *
   * @param id
   */
  saveId(id: number) {
    this.id = id;
  }

  /**
   *  Creation of the category form
   *
   */
  createFormCategory() {
    this.formCategory = this.formBuilder.group({
      tag_category_name: new FormControl(null, [Validators.required]),
      mandatory: new FormControl(null, [Validators.required]),
      multi_choice: new FormControl(null, [Validators.required]),
    });
  }

  /**
   *
   * Sorts the categories according to the index
   *
   */
  onDropped(event: CdkDragDrop<any>) {
    let prev = event.previousIndex;
    let current = event.currentIndex;
    moveItemInArray(this.categories, prev, current);
    let i = 0;
    this.categories.forEach(function (arr) {
      arr.index = i;
      i++;
    });
  }

  /**
   *
   */
  updateIndex() {
    this.categoryService.updateIndex(this.categories).subscribe((resp: any) => {
      this.getCategoryTag();
    });
  }

  /**
   *
   */
  createTag(idCategory: number, idTask: number) {
    this.updateIndex();
    this.router.navigate(["/create-tag", idCategory, idTask]);
  }

  /**
   *
   */
  deleteCategory(id: number) {
    Swal.fire({
      title: this.translate.instant("message.category.areYouSureToDeleteTheCategory"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: this.translate.instant("message.task.no"),
      confirmButtonText: this.translate.instant("message.task.yes"),
    }).then((result) => {
      if (result.value) {
        this.categoryService.deleteCategory(id).subscribe(
          (resp: any) => {
            this.updateIndex();

            //this.getCategoryTag();
          },
          (err) => console.log(err)
        );

        Swal.fire(
          this.translate.instant("message.task.deleted"),
          this.translate.instant("message.category.theCategoryWasSuccessfullyDeleted"),
          "success"
        );
      }
    });
  }

  /**
   *  delete the the selected task
   *
   *  @param task the task to be deleted
   *
   */
  deleteTask() {
    Swal.fire({
      title: this.translate.instant("message.task.areYouSureIWillEliminateTheTask"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: this.translate.instant("message.task.no"),
      confirmButtonText: this.translate.instant("message.task.yes"),
    }).then((result) => {
      if (result.value) {
        this.taskService.deleteTask(this.id).subscribe((resp) => {
          this.updateIndex();
          this.router.navigate(["/task"]);
          Swal.fire(
            this.translate.instant("message.task.deleted"),
            this.translate.instant("message.task.TheTaskHasBeenDeleted"),
            "success"
          );
        });
      }
    });
  }

  /**
   *
   *  Change task status from under construction
   *  to finalized
   *
   *  @param id
   *
   */
  taskFinished() {
    this.taskService.finishTask(this.id).subscribe(
      (resp: any) => {
        this.updateIndex();

        this.router.navigate(["/task-finalize", this.id]);
        Swal.fire({
          icon: "success",
          title: this.translate.instant("message.task.TaskCompletedWithSuccess"),
          text: this.translate.instant("message.task.youCanNowUploadThePostsOrImages"),
        });
      },
      (err) => {
        Swal.fire({
          icon: "error",
          title: this.translate.instant("message.task.TheTaskMustHaveAtLeastOneCategory"),
          text: this.translate.instant("message.task.AllCategoriesOfTheTaskMustHaveAtLeastOneTag"),
        });
      }
    );
  }
}

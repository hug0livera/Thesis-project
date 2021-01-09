import { Component, OnInit } from "@angular/core";
import { TagCategoryModel } from "../../models/tag_category.models";
import { NgForm, FormGroup, FormBuilder, FormControl, Validators, FormArray } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import Swal from "sweetalert2";
import { Observable } from "rxjs/Observable";
import { TranslateService } from "@ngx-translate/core";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";

//Model
import { TaskModel } from "src/app/task/models/tasks.models";
import { TagModel } from "../../../category-tag/models/tag.models";
//Service
import { TagsService } from "../../services/tag.service";
import { CategoriesService } from "../../services/category.service";
import { TasksService } from "../../../task/services/task.service";
@Component({
  selector: "app-category-edit",
  templateUrl: "./category-edit.component.html",
  styleUrls: ["./category-edit.component.css"],
})
export class CategoryEditComponent implements OnInit {
  formCategory: FormGroup;
  idCategory: number;
  idTask: number;
  tag: TagModel[] = [];
  tasks: TaskModel;

  constructor(
    public router: Router,
    private taskService: TasksService,

    private formBuilder: FormBuilder,
    public translate: TranslateService,
    public activatedRoute: ActivatedRoute,
    private categoryService: CategoriesService,
    private tagService: TagsService
  ) {
    activatedRoute.params.subscribe((params) => {
      let id = params["idCategory"];
      let idTask = params["idTask"];
      this.saveIdTask(idTask);
      this.loadCategory(id);
      this.saveId(id);
    });
    this.createFormCategory();
  }

  ngOnInit(): void {
    this.getListTag();
    this.getNameTask();
  }

  /**
   *
   * Upload category values to the form
   * @param id
   *
   */
  loadCategory(id: number) {
    this.categoryService.getsACategory(id).subscribe(
      (resp: any) => {
        const { tag_category_name, index, mandatory, multi_choice } = resp[0];
        this.formCategory.setValue({
          tag_category_name: tag_category_name,
          index: index,
          mandatory: mandatory,
          multi_choice: multi_choice,
        });
      },
      (err) => console.log(err)
    );
  }

  /**
   *
   * Update the category
   *
   */
  updateCategory() {
    const data = {
      ...this.formCategory.value,
    };
    this.categoryService.updateCategory(this.idTask, this.idCategory, data).subscribe(
      (resp) => {
        this.updateIndex();
        Swal.fire({
          icon: "success",
          title: this.translate.instant("message.category.categoryUpdatedSuccessfully"),
        });
      },
      (error) => {
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
   * Gets a list of tags
   *
   */
  getListTag() {
    this.tagService.getListTag(this.idCategory).subscribe(
      (resp: any) => {
        this.tag = resp;
      },
      (err) => console.log(err)
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
    this.taskService.getNameTask(this.idTask).subscribe(
      (resp: any) => {
        this.tasks = resp;
      },
      (err) => console.log(err)
    );
  }

  /**
   *
   * Save the category key
   *
   * @param id
   */
  saveId(id: number) {
    this.idCategory = id;
  }

  /**
   *
   * Save the task key
   *
   * @param id
   */
  saveIdTask(id: number) {
    this.idTask = id;
  }

  /**
   *  Creation of the category form
   *
   */
  createFormCategory() {
    this.formCategory = this.formBuilder.group({
      tag_category_name: new FormControl(null, [Validators.required]),
      index: new FormControl(null, [Validators.required]),
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
    moveItemInArray(this.tag, prev, current);
    let i = 0;
    this.tag.forEach(function (arr) {
      arr.index = i;
      i++;
    });
  }

  /**
   *
   */
  updateIndex() {
    this.tagService.updateIndex(this.tag).subscribe((resp: any) => {
      this.getListTag();
    });
  }
}

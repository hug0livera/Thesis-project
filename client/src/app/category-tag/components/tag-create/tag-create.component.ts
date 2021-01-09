import { Component, OnInit, ElementRef } from "@angular/core";
import { NgForm, FormGroup, FormBuilder, FormControl, Validators, FormArray } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import Swal from "sweetalert2";
import { Observable } from "rxjs/Observable";
import { ViewChild } from "@angular/core";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";

//Model
import { TagCategoryModel } from "../../../category-tag/models/tag_category.models";
import { TagModel } from "../../models/tag.models";
import { TaskModel } from "../../../task/models/tasks.models";

//Service
import { CategoriesService } from "../../services/category.service";
import { TasksService } from "../../../task/services/task.service";
import { TagsService } from "../../services/tag.service";
import { TaskUploadDownloadService } from "src/app/task/services/task-upload-download.service";

@Component({
  selector: "app-tag-create",
  templateUrl: "./tag-create.component.html",
  styleUrls: ["./tag-create.component.css"],
})
export class TagCreateComponent implements OnInit {
  tag: TagModel = new TagModel(null, null, "", "", null);
  tags: TagModel[] = [];
  tagModel: TagModel[] = [];

  categories: TagCategoryModel[] = [];
  task: TaskModel;
  id: number;
  idTask: number;
  color: string = "";
  formTag: FormGroup;
  formFinish: FormGroup;
  /*   fileCsv: File;
  fileImages: File; */
  /*   @ViewChild("inputFile1")
  inputFile1: ElementRef;
  @ViewChild("inputFile2")
  inputFile2: ElementRef; */
  /**
   *
   * @param router
   * @param formBuilder
   * @param translate
   * @param activatedRoute
   * @param tagService
   * @param categoryService
   * @param taskService
   */
  constructor(
    public router: Router,
    private formBuilder: FormBuilder,
    public translate: TranslateService,
    public activatedRoute: ActivatedRoute,
    public tagService: TagsService,
    public categoryService: CategoriesService,
    private taskService: TasksService,
    private UploadDownloadService: TaskUploadDownloadService
  ) {
    activatedRoute.params.subscribe((params) => {
      let id = params["id"];
      let idTask = params["task"];
      this.saveIdCategory(id);
      this.saveIdTask(idTask);
    });
    this.createFormTag();
  }

  ngOnInit(): void {
    this.getTag();
    this.getNameCategory();
    this.getNameTask();
  }

  /**
   *
   * Create the tag
   *
   */
  createTag() {
    //if (this.formTag.invalid) return;

    let tag = new TagModel(
      this.formTag.value.id_tag,
      this.id,
      this.formTag.value.tag_name,
      this.color,
      this.formTag.value.behavior
    );
    this.tagService.createTag(tag).subscribe(
      (resp: any) => {
        Swal.fire({
          icon: "success",
          title: this.translate.instant("message.tag.TagAddedSuccessfully"),
        });
        this.updateIndex();

        this.formTag.reset();
      },
      (err) => {
        Swal.fire({
          icon: "error",
          title: this.translate.instant("message.tag.TheTagNameAlreadyExists"),
          text: this.translate.instant("message.tag.CreateTheTagWithAnotherName"),
        });
      }
    );
  }

  /**
   *
   *  Get a list of a created tags
   *
   *  @param id
   */
  getTag() {
    this.tagService.getListTag(this.id).subscribe(
      (resp: any) => {
        this.tags = resp;
      },
      (err) => console.log(err)
    );
  }

  /**
   *
   * Gets the name of the category
   *
   */
  getNameCategory() {
    this.categoryService.getCategoryName(this.id).subscribe(
      (resp: any) => {
        this.categories = resp;
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
  saveIdCategory(id: number) {
    this.id = id;
  }

  /**
   *
   * Save the category key
   *
   * @param id
   */
  saveIdTask(idTask: number) {
    this.idTask = idTask;
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
        this.task = resp;
      },
      (err) => console.log(err)
    );
  }

  /**
   *
   */
  deleteTag(id: number) {
    Swal.fire({
      title: this.translate.instant("message.tag.YouAreSureToDeleteTheTag"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: this.translate.instant("message.task.no"),
      confirmButtonText: this.translate.instant("message.task.yes"),
    }).then((result) => {
      if (result.value) {
        this.tagService.deleteTag(id).subscribe(
          (resp: any) => {
            this.updateIndex();
          },
          (err) => console.log(err)
        );

        Swal.fire(
          this.translate.instant("message.task.deleted"),
          this.translate.instant("message.tag.TheTagHasBeenDeleted"),
          "success"
        );
      }
    });
  }

  /**
   *
   * Creation of the tag form
   *
   */
  createFormTag() {
    this.formTag = this.formBuilder.group({
      tag_name: new FormControl(null, [Validators.required]),
      color: new FormControl(null, [Validators.required]),
      behavior: new FormControl(null, [Validators.required]),
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
    moveItemInArray(this.tags, prev, current);
    let i = 0;
    this.tags.forEach(function (arr) {
      arr.index = i;
      i++;
    });
  }

  /**
   *
   */
  updateIndex() {
    this.tagService.updateIndex(this.tags).subscribe((resp: any) => {
      this.getTag();
    });
  }

  /**
   *
   */
  addCategory(idTask: number) {
    this.updateIndex();
    this.router.navigate(["/create-category", idTask]);
  }
}

import { Component, OnInit } from "@angular/core";
import { NgForm, FormGroup, FormBuilder, FormControl, Validators, FormArray } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import Swal from "sweetalert2";
import { TranslateService } from "@ngx-translate/core";
//Model
import { TagModel } from "../../models/tag.models";
import { TaskModel } from "../../../task/models/tasks.models";
import { TagCategoryModel } from "../../models/tag_category.models";
//Service
import { TagsService } from "../../services/tag.service";
import { CategoriesService } from "../../services/category.service";
import { TasksService } from "../../../task/services/task.service";

@Component({
  selector: "app-tag-edit",
  templateUrl: "./tag-edit.component.html",
  styleUrls: ["./tag-edit.component.css"],
})
export class TagEditComponent implements OnInit {
  /**
   *
   */
  formTag: FormGroup;
  color: string = "";
  tag: TagModel[] = [];
  idTag: number;
  idCategory: number;
  idTask: number;
  task: TaskModel;

  /**
   *
   *
   * @param router
   * @param formBuilder
   * @param translate
   * @param activatedRoute
   * @param tagService
   * @param categoryService
   */
  constructor(
    public router: Router,
    private formBuilder: FormBuilder,
    public translate: TranslateService,
    public activatedRoute: ActivatedRoute,
    public tagService: TagsService,
    public categoryService: CategoriesService,
    private taskService: TasksService
  ) {
    activatedRoute.params.subscribe((params) => {
      let id = params["idTag"];
      let idCategory = params["idCategory"];
      let idTask = params["idTask"];

      this.loadTag(id);
      this.saveId(id, idCategory, idTask);
    });
    this.createFormTag();
  }

  /**
   *
   */
  ngOnInit(): void {
    this.geTag();
    this.getNameTask();
  }

  /**
   *  Upload the tag to the form
   *
   * @param id
   *
   */
  loadTag(id: number) {
    this.tagService.getOneTag(id).subscribe(
      (resp: any) => {
        const { tag_name, behavior } = resp[0];

        this.formTag.patchValue({
          tag_name: tag_name,
          behavior: behavior,
        });
      },
      (err) => console.log(err)
    );
  }

  /**
   *
   * Gets the data of a tag
   *
   * @param id
   *
   */
  geTag() {
    this.tagService.getOneTag(this.idTag).subscribe(
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
        this.task = resp;
      },
      (err) => console.log(err)
    );
  }

  /**
   *
   * Update the tag
   *
   */
  updateTag() {
    let tag = new TagModel(
      null,
      null,
      this.formTag.value.tag_name,
      this.color,
      this.formTag.value.behavior
    );
    this.tagService.updateTag(this.idTag, this.idCategory, tag).subscribe(
      (resp: any) => {
        Swal.fire({
          icon: "success",
          title: this.translate.instant("message.tag.tagUpdatedSuccessfully"),
        });
        this.geTag();
      },
      (error) => {
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
   * Save the task key
   *
   * @param id
   */
  saveId(id: number, idCategory: number, idTask: number) {
    this.idTag = id;
    this.idCategory = idCategory;
    this.idTask = idTask;
  }

  /**
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
}

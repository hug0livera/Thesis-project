import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Router, ActivatedRoute } from "@angular/router";
import Swal from "sweetalert2";
import { Observable } from "rxjs/Observable";
import { NgForm, FormGroup, FormBuilder, FormControl, Validators, FormArray } from "@angular/forms";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";

//Model
import { TaskModel } from "../../models/tasks.models";
//Service
import { TasksService } from "../../services/task.service";
import { CategoryTagModel } from "../../models/category-tag.models";
import { CategoriesService } from "../../../category-tag/services/category.service";
import { TagCategoryModel } from "../../models/tag_category.models";

@Component({
  selector: "app-task-edit",
  templateUrl: "./task-edit.component.html",
  styleUrls: ["./task-edit.component.css"],
})
export class TaskEditComponent implements OnInit {
  tasks: TaskModel[] = [];
  category: TagCategoryModel[] = [];
  idTask: number;
  formTask: FormGroup;
  formCategory: FormGroup;
  formTag: FormGroup;
  formFinish: FormGroup;
  id: number;

  /**
   *
   * @param taskService
   * @param formBuilder
   */
  constructor(
    private taskService: TasksService,
    private categoryService: CategoriesService,
    private formBuilder: FormBuilder,
    public translate: TranslateService,
    public activatedRoute: ActivatedRoute,
    public router: Router
  ) {
    activatedRoute.params.subscribe((params) => {
      let id = params["id"];
      this.saveId(id);
      this.getTask(id);
      this.getCategory(id);
    });
    this.createFormTask();
  }
  ngOnInit(): void {}
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
   *  Task edit
   */
  editTask() {
    const data = {
      ...this.formTask.value,
    };
    this.taskService.editTask(this.idTask, data).subscribe(
      (resp: any) => {
        this.updateIndex();
        Swal.fire({
          icon: "success",
          title: this.translate.instant("message.task.taskUpdatedSuccessfully"),
        });
      },
      (err) => {
        Swal.fire({
          icon: "error",
          title: this.translate.instant("message.task.theTaskNameExists"),
          text: this.translate.instant("message.task.changeTheTaskName"),
        });
      }
    );
  }

  /**
   *  Get the task to modify and loads the data into the form
   *
   */
  getTask(id: number) {
    this.taskService.getOneTask(id).subscribe(
      (resp: any) => {
        const {
          id_task,
          task_name,
          chance_value,
          random_threshold,
          task_description,
          link_to_guidelines,
        } = resp[0];
        this.idTask = id_task;
        this.formTask.setValue({
          task_name: task_name,
          chance_value: chance_value,
          random_threshold: random_threshold,
          task_description: task_description,
          link_to_guidelines: link_to_guidelines,
        });
      },
      (err) => console.log(err)
    );
  }

  /**
   *  Gets all categories of the task
   *
   */
  getCategory(id: number) {
    this.categoryService.getAllCategories(id).subscribe(
      (resp: any) => {
        this.category = resp;
      },
      (err) => console.log(err)
    );
  }

  /**
   * Task form
   */
  createFormTask() {
    this.formTask = this.formBuilder.group({
      task_name: new FormControl(null, Validators.required),
      chance_value: new FormControl(null, [Validators.required]),
      random_threshold: new FormControl(null, [Validators.required]),
      task_description: new FormControl(null, [Validators.required]),
      link_to_guidelines: new FormControl(null, [Validators.required]),
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
    moveItemInArray(this.category, prev, current);
    let i = 0;
    this.category.forEach(function (arr) {
      arr.index = i;
      i++;
    });
  }

  /**
   *
   */
  updateIndex() {
    this.categoryService.updateIndex(this.category).subscribe((resp: any) => {
      this.getCategory(this.id);
    });
  }
}

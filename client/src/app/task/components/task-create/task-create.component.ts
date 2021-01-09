import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Router, ActivatedRoute } from "@angular/router";
import Swal from "sweetalert2";
import { Observable } from "rxjs/Observable";
import { NgForm, FormGroup, FormBuilder, FormControl, Validators, FormArray } from "@angular/forms";
//Model
import { TaskModel } from "../../models/tasks.models";
//Service
import { TasksService } from "../../services/task.service";
import { CategoryTagModel } from "../../models/category-tag.models";

@Component({
  selector: "app-task-create",
  templateUrl: "./task-create.component.html",
  styleUrls: ["./task-create.component.css"],
})
export class TaskCreateComponent implements OnInit {
  tasks: TaskModel[] = [];
  category: CategoryTagModel[] = [];
  idTask: number;
  formTask: FormGroup;
  formCategory: FormGroup;
  formTag: FormGroup;
  formFinish: FormGroup;

  /**
   *
   * @param taskService
   * @param formBuilder
   */
  constructor(
    private taskService: TasksService,
    private formBuilder: FormBuilder,
    public translate: TranslateService,
    public activatedRoute: ActivatedRoute,
    public router: Router
  ) {
    activatedRoute.params.subscribe((params) => {
      let id = params["id"];
    });
    this.createFormTask();
  }

  /**
   *
   */
  ngOnInit() {
    this.getTasksConstruction();
  }

  /**
   * Task creation
   */
  createTask() {
    if (this.formTask.invalid) return;

    // task creation
    let task = new TaskModel(
      this.formTask.value.id_task,
      this.formTask.value.task_name,
      this.formTask.value.chance_value,
      this.formTask.value.random_threshold,
      this.formTask.value.task_description,
      this.formTask.value.link_to_guidelines
    );
    this.taskService.createTask(task).subscribe(
      (resp: any) => {
        this.getTasksConstruction();
        Swal.fire({
          icon: "success",
          title: this.translate.instant("message.task.taskCreatedSuccessfully"),
        });
        this.formTask.reset();
      },
      (err) => {
        this.formTask.reset();
        Swal.fire({
          icon: "error",
          title: this.translate.instant("message.task.theTaskNameExists"),
          text: this.translate.instant("message.task.changeTheTaskName"),
        });
      }
    );
  }

  /**
   * Get a list of task under construction
   *
   */
  getTasksConstruction() {
    this.taskService.getTasksConstruction().subscribe(
      (resp: any) => {
        this.tasks = resp;
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
      chance_value: new FormControl(),
      random_threshold: new FormControl(),
      task_description: new FormControl(null, [Validators.required]),
      link_to_guidelines: new FormControl(null, [Validators.required]),
    });
  }
}

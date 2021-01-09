import { Component, OnInit, ElementRef } from "@angular/core";
import { ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";

import { TaskUploadDownloadService } from "src/app/task/services/task-upload-download.service";

@Component({
  selector: "app-task-finalize",
  templateUrl: "./task-finalize.component.html",
  styleUrls: ["./task-finalize.component.css"],
})
export class TaskFinalizeComponent implements OnInit {
  id: number;

  fileCsv: File;
  fileImages: File;
  @ViewChild("inputFile1")
  inputFile1: ElementRef;
  @ViewChild("inputFile2")
  inputFile2: ElementRef;
  uploadedFile: boolean = false;
  uploadedImage: boolean = false;
  constructor(
    public translate: TranslateService,

    private UploadDownloadService: TaskUploadDownloadService,
    public activatedRoute: ActivatedRoute
  ) {
    activatedRoute.params.subscribe((params) => {
      let id = params["id"];
      this.saveIdTask(id);
    });
  }

  ngOnInit(): void {}

  /**
   *  Insertion of CSV data on the server
   *
   */
  uploadFile() {
    this.UploadDownloadService.uploadPost(this.id, this.fileCsv).then((resp: any) => {
      this.uploadedFile = true;
      this.inputFile1.nativeElement.value = "";
    });
  }

  /**
   * Insertion of ZIP file on the server
   *
   * @param task
   */
  uploadFileZip() {
    this.UploadDownloadService.uploadFileZip(this.id, this.fileImages).then((resp: any) => {
      this.uploadedImage = true;
      this.inputFile2.nativeElement.value = "";
    });
  }

  /**
   *
   * @param id
   */
  uploadImage() {
    this.UploadDownloadService.uploadImage(this.id).subscribe((resp: any) => {});
  }
  /**
   *  Upload the file
   *
   */
  insertFileZip(file: File) {
    this.fileImages = file;
  }

  /**
   *  Upload the file
   */
  insertFile(file: File) {
    this.fileCsv = file;
  }

  /**
   *
   * Save the category key
   *
   * @param id
   */
  saveIdTask(id: number) {
    this.id = id;
  }
}

import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { TranslateService } from "@ngx-translate/core";
import { saveAs } from "file-saver";
import Swal from "sweetalert2";
import { Observable } from "rxjs/Observable";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class TaskUploadDownloadService {
  private url = "";

  constructor(private http: HttpClient, public translate: TranslateService) {
    this.url = environment.url_server;
  }

  /**
   *
   */
  get token(): string {
    return localStorage.getItem("token") || "";
  }

  /**
   *
   */
  get headers() {
    return {
      headers: {
        "x-token": this.token,
      },
    };
  }

  /**
   *
   *
   * @param id
   * @param fileCsv
   *
   */
  async uploadPost(id: number, fileCsv: File) {
    try {
      const formData = new FormData();
      formData.append("file", fileCsv);
      const url = `${this.url}/upload/${id}`;

      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "x-token": localStorage.getItem("token") || "",
        },
        body: formData,
      });
      const data = await resp.json();

      if (data.ok) {
        Swal.fire({
          icon: "success",
          text: this.translate.instant("message.post.PostUploadedSuccessfully"),
        });
        return true;
      } else {
        Swal.fire({
          icon: "error",
          title: this.translate.instant("message.post.error"),
          text: this.translate.instant("message.post.UploadedFileIsNotAValid"),
        });
        return false;
      }
    } catch (err) {
      return false;
    }
  }

  /**
   *
   *
   * @param id
   * @param fileZip
   *
   */
  async uploadFileZip(id: number, fileZip: File) {
    try {
      const formData = new FormData();
      formData.append("file", fileZip);

      const url = `${this.url}/upload-zip/${id}`;

      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "x-token": localStorage.getItem("token") || "",
        },
        body: formData,
      });

      const data = await resp.json();
      console.log(data);
      //return data;
      if (data.ok) {
        Swal.fire({
          icon: "success",
          title: this.translate.instant("message.post.imagesUploadedSuccessfully"),
        });
        return true;
      } else {
        Swal.fire({
          icon: "error",
          title: this.translate.instant("message.post.ThereAreNoImagesToUpload"),
          text: data.msg,
          //text: this.translate.instant("task.alert.YouCanOnlyUploadZipFiles"),
        });
        return false;
      }
    } catch (err) {
      return false;
    }
  }

  /**
   *
   * @param id
   *
   */
  uploadImage(id: number) {
    let url = this.url + "/upload-image/" + id;
    return this.http
      .put(url, this.headers)
      .map((resp: any) => {
        Swal.fire({
          icon: "success",
          title: this.translate.instant("message.post.imagesUploadedSuccessfully"),
        });

        return resp;
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: this.translate.instant("message.post.error"),
          text: this.translate.instant("message.post.ThereAreNoImagesToUpload"),
        });
        console.log(err.error);
        return Observable.throw(err);
      });
  }

  /**
   *
   * Download the annotations of the task
   *
   * @param task
   *
   */
  /*  downloadTask(id: number, name: string) {
    let url = this.url + "/download-task/" + id;
    return this.http
      .get(url, { responseType: "blob" })
      .toPromise()
      .then((csv) => {
        saveAs(csv, `${name}.csv`);
      })
      .catch((err) => console.error("download error = ", err));
  } */

  /**
   *
   *
   * @param id
   *
   */
  downloadAnnotation(id: number, name: string) {
    let url = this.url + "/download-annotation/" + id;
    return this.http
      .get(url, { responseType: "blob" })
      .toPromise()
      .then((csv) => {
        saveAs(csv, `${name}.csv`);
      })
      .catch((err) => console.error("download error = ", err));
  }

  /**
   *
   *
   * @param id
   *
   */
  downloadCSVFileWithoutAnnotations(id: number, name: string) {
    let url = this.url + "/download-without-annotation/" + id;
    return this.http
      .get(url, { responseType: "blob" })
      .toPromise()
      .then((csv) => {
        saveAs(csv, `${name}.csv`);
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: this.translate.instant("message.post.CSVFileEmpty"),
        });
      });
  }
}

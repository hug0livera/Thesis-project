import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import Swal from "sweetalert2";
import { Observable } from "rxjs/Observable";
import { throwError } from "rxjs";
import { TranslateService } from "@ngx-translate/core";
import { environment } from "../../../environments/environment";

//Model
import { TagModel } from "../models/tag.models";

@Injectable({
  providedIn: "root",
})
export class TagsService {
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
   * Create the tag
   *
   */
  createTag(tag: TagModel) {
    return this.http.post(`${this.url}/create-tag`, tag, this.headers);
  }

  /**
   *
   * Update the tag
   *
   */
  updateTag(idTag: number, idCategory: number, tag: TagModel) {
    let url = this.url + "/edit-tag/" + idTag + "/" + idCategory;
    return this.http.put(url, tag, this.headers);
  }

  /**
   *
   */
  getTags() {
    let url = this.url + "/tags";
    return this.http.get(url, this.headers);
  }

  /**
   *
   *  Get a list of a created tags
   *
   *  @param id
   */
  getListTag(id: number) {
    let url = this.url + "/tags/" + id;
    return this.http.get(url, this.headers);
  }

  /**
   *
   * Gets a list of tags
   *
   */
  getListTags(id: number) {
    let url = this.url + "/tag/" + id;
    return this.http.get(url, this.headers);
  }

  /**
   *
   * Gets the data of a tag
   *
   * @param id
   *
   */
  getOneTag(id: number) {
    let url = this.url + "/tag-one/" + id;
    return this.http.get(url, this.headers);
  }

  /**
   *
   */
  deleteTag(id: number) {
    let url = this.url + "/delete-tag/" + id;
    return this.http.delete(url, this.headers);
  }

  /**
   *
   * Sorts the categories according to the index
   *
   */
  updateIndex(indexCategory: TagModel[]) {
    let url = this.url + "/tag-update-index";
    return this.http.put(url, indexCategory, this.headers);
  }
}

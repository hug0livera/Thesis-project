import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { TranslateService } from "@ngx-translate/core";
import { environment } from "../../../environments/environment";

//Model
import { CategoryTagModel } from "src/app/task/models/category-tag.models";
import { TagCategoryModel } from "../models/tag_category.models";

@Injectable({
  providedIn: "root",
})
export class CategoriesService {
  private url = "";
  categories: TagCategoryModel[] = [];

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
   * Creation of categories
   *
   */
  createCategory(category: TagCategoryModel) {
    return this.http.post(`${this.url}/create-category`, category, this.headers);
  }

  /**
   *
   * Gets only one category
   * Upload category values to the form
   *
   * @param id
   */
  getsACategory(id: number) {
    let url = this.url + "/category/gets-a-category/" + id;
    return this.http.get(url, this.headers);
  }

  /**
   *
   * Gets the category name
   *
   */
  getCategoryName(id: number) {
    let url = this.url + "/category-name/" + id;
    return this.http.get(url, this.headers);
  }

  /**
   * get the categories and tags of a task
   * @param id  task key
   * a
   */
  getCategoryTags(id: number) {
    let url = this.url + "/task-category/" + id;
    return this.http.get(url, this.headers);
  }

  /**
   *
   * Update the category
   *
   */
  updateCategory(idTask: number, id: number, category: CategoryTagModel) {
    let url = this.url + "/edit-category/" + idTask + "/" + id;
    return this.http.put(url, category, this.headers);
  }

  /**
   *
   * Gets all categories of a task
   *
   */
  getAllCategories(id: number) {
    let url = this.url + "/categories/" + id;
    return this.http.get(url, this.headers);
  }

  /**
   *
   * Sorts the categories according to the index
   *
   */
  updateIndex(indexCategory: TagCategoryModel[]) {
    let url = this.url + "/update-index";
    return this.http.put(url, indexCategory, this.headers);
  }

  /**
   *
   */
  deleteCategory(id: number) {
    let url = this.url + "/delete-category/" + id;
    return this.http.delete(url, this.headers);
  }
}

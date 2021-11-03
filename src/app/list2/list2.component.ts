import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list2',
  templateUrl: './list2.component.html',
  styleUrls: ['./list2.component.css'],
})
export class List2Component implements OnInit {
  constructor(protected http: HttpClient) {}
  products = [];
  displayProducts = [];
  choseProducts = [];
  searchText = '';

  ngOnInit() {
    this.getData();
  }

  //Lấy dữ liệu
  getData() {
    this.http.get('assets/data2.json').subscribe((data) => {
      this.products = this.mapData(data['data']);
      this.products.forEach((element) => {
        this.displayProducts.push(element);
      });
    });
  }
  mapData(products) {
    let mapped = products.map((item) => {
      if (item.fields) item.fields = this.mapData(item.fields);
      item.extended = false;
      item.chose = false;
      if (item.fields) {
        item.fieldsShow = [];
        item.fields.forEach((element) => {
          item.fieldsShow.push(element);
        });
      }
      return item;
    });
    mapped[0].extended = true;
    return mapped;
  }

  //Thay đổi checkbox
  choose(item) {
    item.chose = !item.chose;
    if (item.fields) {
      if (item.chose)
        item.fields.forEach((i) => {
          if (!i.chose) this.choose(i);
        });
      else
        item.fields.forEach((i) => {
          if (i.chose) this.choose(i);
        });
    }
    if (!this.choseProducts.includes(item) && item.chose && !item.fields) {
      this.choseProducts.push(item);
    }
    if (this.choseProducts.includes(item) && !item.chose && !item.fields) {
      this.choseProducts = this.choseProducts.filter((i) => i != item);
    }
    if (item.field_name) {
      let parent: any;
      parent = this.products.find((i) => i.fields.includes(item));
      if (!parent) {
        this.products.every((i) => {
          parent = i.fields.find((e) => e.fields?.includes(item));
          if (parent) return false;
          else return true;
        });
      }
      if (parent.fields.every((i) => i.chose)) parent.chose = true;
      else parent.chose = false;
    }
  }

  //Tìm kiếm
  search(text: string) {
    let result = [];
    this.products.forEach((item) => {
      if (item.group.toLowerCase().includes(text.toLowerCase())) {
        item.extended = true;
        if (item.fields) {
          item.fieldsShow = [];
          item.fields.forEach((i) => {
            item.fieldsShow.push(i);
            i.extended = true;
            if (i.fields) {
              i.fieldsShow = [];
              i.fields.forEach((element) => {
                element.extended = true;
                i.fieldsShow.push(element);
              });
            }
          });
        }
        result.push(item);
      } else if (item.fields) {
        let fields = [];
        item.fields.forEach((i) => {
          if (i.field_name.toLowerCase().includes(text.toLowerCase())) {
            i.extended = true;
            if (i.fields) {
              i.fieldsShow = [];
              i.fields.forEach((element) => {
                element.extended = true;
                i.fieldsShow.push(element);
              });
            }
            fields.push(i);
          } else if (i.fields) {
            let fields1 = [];
            i.fields.forEach((element) => {
              if (
                element.field_name.toLowerCase().includes(text.toLowerCase())
              ) {
                element.extended = true;
                fields1.push(element);
              }
            });
            if (fields1.length > 0) {
              i.fieldsShow = fields1;
              i.extended = true;
              fields.push(i);
            }
          }
        });
        if (fields.length > 0) {
          item.fieldsShow = fields;
          item.extended = true;
          result.push(item);
        }
      }
    });
    this.displayProducts = result;
  }
}

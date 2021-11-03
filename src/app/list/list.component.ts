import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  constructor(protected http: HttpClient) {}
  products: any;
  displayProducts = [];
  choseProducts = [];
  searchText = '';

  ngOnInit() {
    this.getData();
  }

  //Lấy dữ liệu
  getData() {
    this.http.get('assets/data.json').subscribe((data) => {
      this.products = this.mapData(data['data']);
      this.products.forEach((element) => {
        this.displayProducts.push(element);
      });
    });
  }
  mapData(products) {
    let mapped = products.map((item) => {
      if (item.sub) item.sub = this.mapData(item.sub);
      item.extended = false;
      item.chose = false;
      if (item.sub) {
        item.subShow = [];
        item.sub.forEach((element) => {
          item.subShow.push(element);
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
    if (item.sub && item.chose) {
      item.sub.forEach((i) => {
        if (!i.chose) this.choose(i);
      });
    }
    if (!this.choseProducts.includes(item) && item.chose) {
      this.choseProducts.push(item);
    }
    if (this.choseProducts.includes(item) && !item.chose) {
      this.choseProducts = this.choseProducts.filter((i) => i != item);
    }
  }

  //Tìm kiếm
  search(text: string) {
    let result = [];
    this.products.forEach((item) => {
      if (item.name.vi.toLowerCase().includes(text.toLowerCase())) {
        item.extended = true;
        if (item.sub) {
          item.subShow = [];
          item.sub.forEach((i) => {
            item.subShow.push(i);
            i.extended = true;
            if (i.sub) {
              i.subShow = [];
              i.sub.forEach((element) => {
                element.extended = true;
                i.subShow.push(element);
              });
            }
          });
        }
        result.push(item);
      } else if (item.sub) {
        let sub = [];
        item.sub.forEach((i) => {
          if (i.name.vi.toLowerCase().includes(text.toLowerCase())) {
            i.extended = true;
            if (i.sub) {
              i.subShow = [];
              i.sub.forEach((element) => {
                element.extended = true;
                i.subShow.push(element);
              });
            }
            sub.push(i);
          } else if (i.sub) {
            let sub1 = [];
            i.sub.forEach((element) => {
              if (element.name.vi.toLowerCase().includes(text.toLowerCase())) {
                element.extended = true;
                sub1.push(element);
              }
            });
            if (sub1.length > 0) {
              i.subShow = sub1;
              i.extended = true;
              sub.push(i);
            }
          }
        });
        if (sub.length > 0) {
          item.subShow = sub;
          item.extended = true;
          result.push(item);
        }
      }
    });
    this.displayProducts = result;
  }
}

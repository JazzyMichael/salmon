import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  sort: string;
  posts: any[];

  constructor() { }

  ngOnInit() {
    this.sort = 'recent';
    this.posts = new Array(20);
    const posty = {
      title: 'Simple Fried Salmon on tin foil',
      description: 'daj adk foi blaidu bneja; iw oewefd',
      thumbnailUrl: 'assets/test-salmon-vertical.jpg'
    };
    this.posts.fill(posty);
  }

  changeSort() {
    this.sort = this.sort === 'recent' ? 'top' : 'recent';
  }

}

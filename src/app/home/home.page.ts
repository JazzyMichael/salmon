import { Component, OnInit } from '@angular/core';
import { SEOService } from '../services/seo.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  sort: string;
  posts: any[];

  constructor(
    private seo: SEOService
  ) { }

  ngOnInit() {
    this.sort = 'recent';
    this.posts = new Array(20);
    const posty = {
      id: 'potato1234shh',
      title: 'Simple Fried Salmon on tin foil',
      description: 'daj adk foi blaidu bneja; iw oewefd',
      thumbnailUrl: 'assets/test-salmon-vertical.jpg'
    };
    this.posts.fill(posty);
  }

  ionViewDidEnter() {
    console.log('home view did enter');
    this.seo.updateTags({});
  }

  changeSort() {
    this.sort = this.sort === 'recent' ? 'top' : 'recent';
  }

}

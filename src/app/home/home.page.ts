import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  sort: string;

  constructor() { }

  ngOnInit() {
    this.sort = 'recent';
  }

  changeSort() {
    this.sort = this.sort === 'recent' ? 'top' : 'recent';
  }

}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
  segment: string = 'app';

  constructor() { }

  ngOnInit() {
  }

  segmentChanged(event: any) {
    this.segment = event.target.value;
  }

}

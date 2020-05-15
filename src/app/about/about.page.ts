import { Component, OnInit, OnDestroy } from '@angular/core';
import { SEOService } from '../services/seo.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit, OnDestroy {
  segment: string = 'app';

  constructor(private seo: SEOService) { }

  ngOnInit() { }

  ionViewDidEnter() {
    this.seo.updateTags({
      title: 'About | Salmon',
      description: 'The best community gathered around admiring, catching, cooking, and eating salmon!',
      url: 'https://theartofcookingsalmon/about'
    });
  }

  ngOnDestroy() {
    this.seo.updateTags({});
  }

  segmentChanged(event: any) {
    this.segment = event.target.value;
  }

}

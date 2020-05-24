import { Component, OnInit, OnDestroy } from '@angular/core';
import { SEOService } from '../services/seo.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit, OnDestroy {
  segment: string;

  constructor(
    private seo: SEOService,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit() { }

  ionViewDidEnter() {
    this.seo.updateTags({
      title: 'About | Salmon',
      description: 'The best community gathered around admiring, catching, cooking, and eating salmon!',
      url: 'https://theartofcookingsalmon/about'
    });

    this.segment = location.toString().split('/')[4] || 'app';
  }

  ngOnDestroy() {
    this.seo.updateTags({});
  }

  segmentChanged(event: any) {
    this.segment = event.target.value;
    const routeSegmentUrl = this.segment === 'fish' ? '/about/fish' : '/about/app';
    this.router.navigateByUrl(routeSegmentUrl);
  }

}

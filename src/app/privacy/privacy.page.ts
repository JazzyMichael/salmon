import { Component, OnInit } from '@angular/core';
import { SEOService } from '../services/seo.service';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.page.html',
  styleUrls: ['./privacy.page.scss'],
})
export class PrivacyPage implements OnInit {

  constructor(private seo: SEOService) { }

  ngOnInit() {
    this.seo.updateTags({});
  }

}

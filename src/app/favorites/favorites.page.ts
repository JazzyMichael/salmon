import { Component, OnInit } from '@angular/core';
import { SEOService } from '../services/seo.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit {

  constructor(
    public auth: AuthService,
    private seo: SEOService
  ) { }

  ngOnInit() {
    this.seo.updateTags({});
  }

}

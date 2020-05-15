import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { SEOService } from '../services/seo.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    private auth: AuthService,
    private seo: SEOService
  ) { }

  ngOnInit() {
    this.seo.updateTags({
      title: 'Login | Salmon',
      description: 'Sign Up for the greatest Salmon App in 2020,!',
      url: 'https://theartofcookingsalmon/login'
    });
  }

  appleLogin() {
    this.auth.login();
  }

  googleLogin() {
    this.auth.login();
  }

}

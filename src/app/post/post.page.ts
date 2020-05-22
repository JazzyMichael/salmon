import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, catchError } from 'rxjs/operators';
import { SEOService } from '../services/seo.service';
import { PostService } from '../services/post.service';
import { AuthService } from '../services/auth.service';
import { Location } from '@angular/common';
import { ActionSheetController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit, OnDestroy {
  post: any;
  editable: boolean;
  slideOpts: any = {
    autoHeight: true
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private seo: SEOService,
    private postService: PostService,
    private auth: AuthService,
    private location: Location,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController
  ) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap(params => of(params.get('id'))),
      switchMap(id => this.postService.getById(id)),
      catchError(error => of(this.router.navigateByUrl('/')))
    )
    .subscribe(post => {
      console.log(post);
      this.post = post;
      this.editable = this.post && this.post.userId && this.post.userId === this.auth.uid;
      this.seo.updateTags({
        title: `${this.post.title} | Salmon`,
        description: `${this.post.description} ${this.post.location}. The Art of Cooking Salmon.`,
        url: `https://theartofcookingsalmon.com${this.location.path()}`,
        imageUrl: ''
      });
    });
  }

  ngOnDestroy() {
    this.seo.updateTags({});
  }

  share() {
    console.log('shared!');
  }

  edit() {
    console.log('edited!');
  }

  delete() {
    console.log('deleted!');
  }

  async showDeleteConfirmation() {
    const alert = await this.alertController.create({
      header: 'Delete this Post',
      message: 'Are you sure?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Delete', handler: this.delete }
      ]
    });
    await alert.present();
  }

  async showActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        { text: 'Delete', role: 'destructive', handler: async () => { await this.showDeleteConfirmation(); return true; } },
        { text: 'Edit', handler: this.edit },
        { text: 'Share', handler: this.share },
        { text: 'Cancel', role: 'cancel' }
      ]
    });
    await actionSheet.present();
  }

}

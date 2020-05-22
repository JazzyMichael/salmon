import { Component, OnInit, OnDestroy } from '@angular/core';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, catchError, tap } from 'rxjs/operators';
import { SEOService } from '../services/seo.service';
import { PostService } from '../services/post.service';
import { AuthService } from '../services/auth.service';
import { Location } from '@angular/common';
import { ActionSheetController, AlertController, ToastController } from '@ionic/angular';

import { Plugins } from '@capacitor/core';

const { Storage, Share, Clipboard } = Plugins;

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit, OnDestroy {
  post: any;
  postId: string;
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
    private toaster: ToastController,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController
  ) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap(params => of(params.get('id'))),
      tap(id => this.postId = id),
      switchMap(id => this.postService.getById(id)),
      catchError(error => of(this.router.navigateByUrl('/')))
    )
    .subscribe(post => {
      console.log(post);
      if (!post) return;
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

  edit() {
    console.log('edited!');
  }

  async showDeleteConfirmation() {
    const self = this;
    const alert = await this.alertController.create({
      header: 'Delete this Post',
      message: 'Are you sure?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Delete', handler: async () => {
            console.log('deleting: ' + this.postId);
            await this.postService.delete(this.postId);
            const toast = await this.toaster.create({
              message: 'Deleted',
              duration: 2345,
              position: 'top'
            });
            toast.present();
            await this.router.navigateByUrl('/');
            return true;
          }
        }
      ]
    });
    await alert.present();
  }

  async showActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        { text: 'Delete', role: 'destructive', handler: async () => { await this.showDeleteConfirmation(); return true; } },
        { text: 'Edit', handler: this.edit },
        { text: 'Share', handler: async () => { await this.share(); return true; } },
        { text: 'Cancel', role: 'cancel' }
      ]
    });
    await actionSheet.present();
  }

  async share() {
    try {
      await Share.share({
        title: 'The Art of Cooking Salmon',
        text: 'Beautiful & tasty, Lets Eat! Share your Salmon at The Art of Cooking Salmon .com! ',
        url: 'http://theartofcookingsalmon.com/',
        dialogTitle: 'Share'
      });
    } catch (e) {
      // desktop
      await Clipboard.write({
        string: 'https://theartofcookingsalmon.com'
      });
      const toast = await this.toaster.create({
        message: 'Link Copied :)',
        duration: 2345,
        position: 'top'
      });
      toast.present();
    }
  }

}

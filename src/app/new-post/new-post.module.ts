import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NewPostPageRoutingModule } from './new-post-routing.module';
import { NewPostPage } from './new-post.page';
import { ImageCropComponent } from './image-crop/image-crop.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ImageCropperModule,
    NewPostPageRoutingModule
  ],
  declarations: [
    NewPostPage,
    ImageCropComponent
  ],
  entryComponents: [
    ImageCropComponent
  ]
})
export class NewPostPageModule {}

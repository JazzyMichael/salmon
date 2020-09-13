import { Component, Inject, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CropperPosition, Dimensions, ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-image-crop',
  templateUrl: './image-crop.component.html',
  styleUrls: ['./image-crop.component.scss'],
})
export class ImageCropComponent implements OnInit {

  @Input() imageFile: any;
  @Input() cropperPosition?: CropperPosition;
  cropper: any = {};
  newCropperPosition: CropperPosition;
  croppedImage: any;
  loading: boolean;
  aspectRatio = 4 / 3;
  canvasRotation = 0;
  cropperMinWidth = 240;
  cropperMinHeight = 240;

  constructor(
    @Inject(ModalController) private modalController: ModalController
  ) { }

  ngOnInit() {
  }

  back() {
    this.modalController.dismiss({
      cancel: true
    });
  }

  save() {
    this.modalController.dismiss({
      imageFile: this.imageFile,
      croppedImage: this.croppedImage,
      cropperPosition: this.newCropperPosition
    });
  }

  toggleAspectRatio() {
    this.aspectRatio = this.aspectRatio === 3 / 4 ? 4 / 3 : 3 / 4;
  }

  rotate(modifier: 1 | -1) {
    this.canvasRotation += modifier;
    this.loading = true;
  }

  loadImageFailed() {
    console.log('cropper failed to load image');
  }

  cropperReady(dimensions: Dimensions) {
    console.log('cropper ready', dimensions);
    if (this.cropperPosition) {
      setTimeout(() => this.cropper = { ...this.cropperPosition }, 100);
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.newCropperPosition = event.cropperPosition;
    this.loading = false;
  }

}

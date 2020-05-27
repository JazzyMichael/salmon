import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SEOService {
  default: any = {
    title: 'Salmon',
    description: 'The Art of Cooking Salmon - Praise this beautiful & tasty fish!',
    imageUrl: 'https://theartofcookingsalmon.com/assets/salmon-outline.jpg',
    url: 'https://theartofcookingsalmon.com'
  };

  constructor(
    private title: Title,
    private meta: Meta
  ) { }

  updateTags({
    title = this.default.title,
    description = this.default.description,
    imageUrl = this.default.imageUrl,
    url = this.default.url
  }) {

    // Title
    this.title.setTitle(title);
    this.meta.updateTag({ name: 'og:title', content: title });
    this.meta.updateTag({ name: 'twitter:title', content: title });

    // Description
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'og:description', content: description });
    this.meta.updateTag({ name: 'twitter:description', content: description });

    // Image
    this.meta.updateTag({ name: 'og:image', content: imageUrl });
    this.meta.updateTag({ name: 'twitter:image', content: imageUrl });

    // URL
    this.meta.updateTag({ name: 'og:url', content: url });

  }
}

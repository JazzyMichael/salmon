import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private fireStore: AngularFirestore) { }

  getAll(sort: string = 'recent') {
    const field = sort === 'recent' ? 'createdAt' : 'likes';
    return this.fireStore
      .collection('posts', ref => ref.orderBy(field, 'desc').limit(10))
      .valueChanges({ idField: 'id' });
  }

  getById(id: string) {
    return this.fireStore.doc(`posts/${id}`).valueChanges();
  }

  getByUserId(userId: string) {
    return this.fireStore
      .collection('posts', ref => ref.where('userId', '==', userId).limit(20))
      .valueChanges({ idField: 'id' });
  }

  create(post: any) {
    return this.fireStore.collection('posts').add(post);
  }

  update(id: string, obj: any) {
    return this.fireStore.doc(`posts/${id}`).update(obj);
  }

  delete(id: string) {
    return this.fireStore.doc(`posts/${id}`).delete();
  }

}

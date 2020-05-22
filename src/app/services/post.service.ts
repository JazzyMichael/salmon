import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private fireStore: AngularFirestore) { }

  getAll(sort: string = 'recent') {
    // TODO
    // - map user ids to usernames with memoization
    // - implement pagination
    // - post interface

    const order = sort === 'recent' ? 'createdAt' : 'likes';

    return this.fireStore
      .collection('posts', ref => ref.orderBy(order, 'desc').limit(10))
      .valueChanges({ idField: 'id' });
  }

  getById(id: string) {
    return this.fireStore.doc(`posts/${id}`).valueChanges();
  }

  getByUserId(userId: string) {
    return this.fireStore
      .collection('posts', ref => ref.where('userId', '==', userId))
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

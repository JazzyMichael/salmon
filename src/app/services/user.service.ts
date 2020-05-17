import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private fireStore: AngularFirestore) { }

  getById(id: string) {
    return this.fireStore.doc(`users/${id}`).valueChanges();
  }

  async update(uid: string, field: string, value: string) {
    const objecto = {};
    objecto[field] = value;
    await this.fireStore.doc(`users/${uid}`).update(objecto);
  }

}

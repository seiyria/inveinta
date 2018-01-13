import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class FirebaseProvider {

  public get authState() {
    return this.afAuth.authState;
  }

  public get auth() {
    return this.afAuth.auth;
  }

  constructor(
    private afAuth: AngularFireAuth
  ) {}

}

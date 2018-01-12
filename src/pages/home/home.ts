import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  private loginInformation: FormGroup;

  constructor(
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    public afAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    this.loginInformation = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    });
  }

  async login() {
    const { email, password } = this.loginInformation.value;

    try {
      await this.afAuth.auth.signInWithEmailAndPassword(email, password);

    } catch(e) {
      console.error('sign-in', e);

      // register account if it does not exist
      if(e.code === 'auth/user-not-found') {
        try {
          await this.afAuth.auth.createUserWithEmailAndPassword(email, password);
        } catch(e) {
          console.error('create-user', e);
        }
      }
    }

  }

  logout() {
    this.afAuth.auth.signOut();
  }

}

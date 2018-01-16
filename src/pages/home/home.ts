import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { FirebaseProvider } from '../../providers/firebase/firebase';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit, OnDestroy {

  private loginInformation: FormGroup;
  public errorMessage: string;

  private auth$: Subscription;

  constructor(
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    public firebase: FirebaseProvider
  ) {}

  ngOnInit() {
    this.loginInformation = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    });

    // if we're signed in at any point, load the app home page
    this.auth$ = this.firebase.authState.subscribe(data => {
      if(!data) return;
      this.loadAppHomePage();
    });
  }

  ngOnDestroy() {
    this.auth$.unsubscribe();
  }

  async login() {
    const { email, password } = this.loginInformation.value;
    this.errorMessage = '';

    try {
      await this.firebase.auth.signInWithEmailAndPassword(email, password);

    } catch(e) {
      console.error('sign-in', e);

      // register account if it does not exist
      if(e.code === 'auth/user-not-found') {
        try {
          await this.firebase.auth.createUserWithEmailAndPassword(email, password);
        } catch(e) {
          console.error('create-user', e);
        }
      } else {
        this.errorMessage = e.message;
      }
    }

  }

  private loadAppHomePage() {
    this.navCtrl.setRoot('Collections');
  }

}

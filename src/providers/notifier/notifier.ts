import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

@Injectable()
export class NotifierProvider {

  constructor(
    private toastCtrl: ToastController
  ) {}

  public toast(message: string) {
    this.toastCtrl.create({
      duration: 3000,
      message,
      showCloseButton: true
    }).present();
  }
}

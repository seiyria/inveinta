import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AppHomePage } from './app-home';

@NgModule({
  declarations: [
    AppHomePage,
  ],
  imports: [
    IonicPageModule.forChild(AppHomePage),
  ],
})
export class AppHomePageModule {}

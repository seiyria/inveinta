import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { ProvidersModule } from '../providers/providers.module';
import { FirebaseProvider } from '../providers/firebase/firebase';
import { AddItemModal } from '../pages/app-collections-detail/additem.modal';
import { ModifyCollectionPopover } from '../pages/app-collections-detail/modifycollection.popover';
import { ModifyItemPopover } from '../pages/app-collections-detail/modifyitem.popover';
import { ShareCollectionModal } from '../pages/app-collections-detail/sharing.modal';
import { NotifierProvider } from '../providers/notifier/notifier';
import { Ionic2RatingModule } from 'ionic2-rating';

@NgModule({
  declarations: [
    MyApp,
    HomePage,

    AddItemModal,
    ShareCollectionModal,
    ModifyCollectionPopover,
    ModifyItemPopover
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ProvidersModule,
    IonicModule.forRoot(MyApp),
    Ionic2RatingModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,

    AddItemModal,
    ShareCollectionModal,
    ModifyCollectionPopover,
    ModifyItemPopover
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FirebaseProvider,
    NotifierProvider
  ]
})
export class AppModule {}

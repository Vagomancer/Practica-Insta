import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { FcmService } from './services/fcm.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private fcm: FcmService
  ) {
    this.platform.ready().then(() => {
      this.fcm.initPush(); 
    }).catch(e => {
      console.log('error fcm: ', e);
    });
  }
}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// =========Firebase=================
import {AngularFireModule} from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { TermsAndConditions } from './shared/components/terms-and-conditions/terms-and-conditions.component';


@NgModule({
  declarations: [AppComponent,TermsAndConditions],
  imports: [IonicModule,BrowserModule, IonicModule.forRoot({mode: 'md'}), AppRoutingModule, AngularFireModule.initializeApp(environment.firebaseConfig), HttpClientModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule {}
export class TermsAndConditionsModule { }
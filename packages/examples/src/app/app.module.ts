import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {AngularDndCoreModule} from '@angular-dnd/core';
import {createDefaultMultiBackendFactory} from '@angular-dnd/multi-backend';
import {AngularDndMultiBackendModule} from '@angular-dnd/multi-backend';
import {defaultMultiBackendFactory} from '@angular-dnd/multi-backend';

console.log('createDefaultMultiBackendFactory', typeof createDefaultMultiBackendFactory, createDefaultMultiBackendFactory);

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularDndMultiBackendModule,
    AngularDndCoreModule.forRoot({
        // backendFactory: createDefaultMultiBackendFactory,
        backend: defaultMultiBackendFactory,
      },
    ),
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

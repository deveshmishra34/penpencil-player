import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { PenpencilPlayerModule } from 'penpencil-player';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    PenpencilPlayerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

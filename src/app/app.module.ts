import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './layout/layout.component';
import { HttpClientModule } from '@angular/common/http';
import { allIntersept } from './core/interceptors/exportintersept';


@NgModule({
  declarations: [
    AppComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutComponent,
    HttpClientModule,
    allIntersept
    

    
    
],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

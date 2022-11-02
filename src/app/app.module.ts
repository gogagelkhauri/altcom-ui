import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {HttpClientModule} from "@angular/common/http";
import {NgOptimizedImage} from "@angular/common";
import {ImgImplementationComponent} from "./image-component/img-implementation.component";
import {ImgDirective} from "./image-component/img.directive";
import {ImgCardComponent} from "./image-component/img-card.component";
import {GameService} from "./services/game.service";


@NgModule({
  declarations: [
    AppComponent,
    ImgImplementationComponent,
    ImgDirective,
    ImgCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DragDropModule,
    HttpClientModule,
    NgOptimizedImage
  ],
  providers: [GameService],
  bootstrap: [AppComponent]
})
export class AppModule { }

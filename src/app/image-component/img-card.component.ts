import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {ImgComponent} from "./img.component";
import {ImgDirective} from "./img.directive";
import {ImgItem} from "./img-item";
import {GameService} from "../services/game.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-img-card',
  template: `
      <ng-template imgHost></ng-template>
  `,
})
export class ImgCardComponent implements OnInit {
  subscription: Subscription | undefined;

  answerSubmittedSubscription: Subscription | undefined;

  @ViewChild(ImgDirective, { static: true }) imgHost!: ImgDirective;

  constructor(private gameService: GameService) {
     this.gameService.fetchRandomImages();
  }

  ngOnInit(): void {
    this.subscription = this.gameService.imagesFetched.subscribe(value => {
      this.gameService.setImageHost(this.imgHost);
      this.gameService.loadComponent();
      this.gameService.getImages1();
    })

    this.answerSubmittedSubscription = this.gameService.answerSubmitted.subscribe(_ => {
      this.gameService.setImageHost(this.imgHost);
      this.gameService.loadComponent();
      this.gameService.getImages1();
    })
  }
}

import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ApiService} from "./services/api.service";
import {Nation} from "./models/Nation";
import {GameSession} from "./models/GameSession";
import {CookieService} from "ngx-cookie-service";
import {Image} from "./models/Image";
import {ImgItem} from "./image-component/img-item";
import {GameService} from "./services/game.service";
import {Subscription} from "rxjs";
import {HttpParams} from "@angular/common/http";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit,AfterViewInit,OnDestroy{

  nations : Nation[] | undefined;
  playGame: boolean  = true;

  totalPoints : number = 0;
  totalPointsSubscription: Subscription | undefined;


  constructor(private apiService: ApiService,
              private cookieService: CookieService,
              public gameService: GameService) {
    this.cookieService.deleteAll();
  }

  ngOnInit(): void {
    this.fetchNations();

    this.totalPointsSubscription = this.gameService.reloadPoints.subscribe(value => {
        this.fetchPoints();
    })
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy() {
  }

  fetchPoints () {
    let gameSession = <GameSession> JSON.parse(this.cookieService.get('GameSession'));
    const params = new HttpParams()
      .set('gameSessionId', gameSession.id)

    this.apiService.get(`/GameSession/GetGameSessionPoints`,params).subscribe({
      next: (data: number) => {
        this.totalPoints = data
      },
      error: () => {
        console.log("Error Occured");
      }
    });
  }

  startGame(){
    this.apiService.post('/GameSession/StartSession').subscribe({
      next: (data: any) => {
        let gameSession = <GameSession> data;
        this.cookieService.set('GameSession',JSON.stringify(gameSession))
        this.playGame = false;
        this.gameService.gameEnd = false;
      },
      error: () => {
        console.log("Error Occured at StartSession");
      }
    });
  }

  fetchNations(){
    this.apiService.get('/Nation/Nations').subscribe({
        next: (data: any) => {
          this.nations = <Nation[]> data;
        },
        error: () => {
          console.log("Error Occured");
      }
    });
  }

  submitAnswer(nation: Nation){
      this.gameService.processingAnswer = true;
      this.gameService.setCurrentImageAnswer(nation.id);
      this.gameService.submitAnswer();
      //this.gameService.processingAnswer = false;
  }


}

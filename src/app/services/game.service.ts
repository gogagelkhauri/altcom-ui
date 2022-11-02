import {Injectable, ViewChild} from '@angular/core';
import {ImgImplementationComponent} from "../image-component/img-implementation.component";
import {ImgItem} from "../image-component/img-item";
import {CookieService} from "ngx-cookie-service";
import {Image} from "../models/Image";
import {Subject} from "rxjs";
import {ApiService} from "./api.service";
import {HttpHeaders} from "@angular/common/http";
import {GameSession} from "../models/GameSession";
import {ImgComponent} from "../image-component/img.component";
import {ImgDirective} from "../image-component/img.directive";



@Injectable()
export class GameService {

  private imgItems : ImgItem[] = [];
  private currentImage: ImgItem | undefined;
  public imagesFetched: Subject<any> = new Subject<any>();
  public reloadPoints: Subject<any> = new Subject<any>();

  public answerSubmitted: Subject<any> = new Subject<any>();

  public gameEnd : boolean | undefined;

  public processingAnswer: boolean| undefined;

  //
  currentImgIndex = -1;
  questionCounter: number = -1;
  interval: number | undefined;
  @ViewChild(ImgDirective, { static: true }) imgHost!: ImgDirective;


  constructor( private cookieService: CookieService,private apiService : ApiService) {
  }

  public setCurrentImage(image: ImgItem){
    this.currentImage = image;
  }

  public getCurrentImage() : ImgItem{
    return  this.currentImage!;
  }

  public setCurrentImageAnswer(nationId: number){
    this.currentImage!.data.selectedNation = nationId;
  }

  setImages(images: Image[]){
    this.imgItems = images.map((x : any) => {
      return  new ImgItem(
        ImgImplementationComponent,
        { name: x.name, imageData: x.imageData, id: x.id }
      );
    })
    this.imagesFetched.next(1);
  }

  getImages() : ImgItem[]{
    return  this.imgItems;
  }

  fetchRandomImages(){
    this.apiService.get('/GameSession/GetRandomImages').subscribe({
      next: (data: any) => {
        let localImages = <Image[]> data;
        this.setImages(localImages);
      },
      error: () => {
        console.log("Error Occured");
      }
    });
  }

  submitAnswer(){

    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    };
    let gameSession = <GameSession> JSON.parse(this.cookieService.get('GameSession'));
    let par = {
      "gameSessionId": gameSession.id,
      "imageId": this.getCurrentImage().data.id,
      "answeredNationId" : this.getCurrentImage().data.selectedNation
    };

    this.apiService.postWithOptions('/GameSession/SubmitAnswer',par,options).subscribe({
      next: (data: any) => {
        this.reloadPoints.next(1);
        this.processingAnswer = false;

      },
      error: () => {
        console.log("Error Occured");
      }
    });

    this.iterateNext();
  }

  public iterateNext(){
    clearInterval(this.interval);
    this.imgHost.viewContainerRef.clear();
    //this.currentImgIndex++;
    this.answerSubmitted.next(1);
  }

  loadComponent() {
    this.currentImgIndex = (this.currentImgIndex + 1) % this.getImages().length;
    console.log(this.currentImgIndex);
    const imgItem = this.getImages()[this.currentImgIndex];
    this.setCurrentImage(imgItem);

    const viewContainerRef = this.imgHost.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent<ImgComponent>(
     imgItem.component
      //this.currentImage!.component
    );
    componentRef.instance.data = imgItem.data;
   // componentRef.instance.data = this.currentImage!.data;

    this.questionCounter++;

    if(this.questionCounter === 10){
      this.gameEnd = true;
    }
  }


    public setImageHost(imgHost: ImgDirective){
    this.imgHost = imgHost;
  }
  getImages1() {
    //this.imgHost = imgHost;
    this.interval = window.setInterval(() => {
      if(this.questionCounter < 10){
        this.loadComponent();
      }
    }, 3000);
  }
}

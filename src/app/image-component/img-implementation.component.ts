import { Component, Input } from '@angular/core';
import {ImgComponent} from "./img.component";


@Component({
  template: `
<!--    <div class="hero-profile">-->
<!--      <h3>Featured Hero Profile</h3>-->
<!--      <h4>{{data.name}}</h4>-->

<!--      <p>{{data.bio}}</p>-->

<!--      <strong>Hire this hero today!</strong>-->
<!--    </div>-->
    <div class="image" [style.background-image]="'url(data:image/png;base64,' + data.imageData + ')'">

    </div>
  `,
  styleUrls: ['./img-impl.component.scss']
})
export class ImgImplementationComponent implements ImgComponent {
  @Input() data: any;
}


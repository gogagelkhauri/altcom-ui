import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[imgHost]',
})
export class ImgDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}


import { AfterViewInit, Directive, ElementRef, Input, Renderer2 } from '@angular/core';

const OPTIONS = {
  threshold: 0.25,
  rootMargin: '0px 0px 100px 0px'
};

@Directive({
  selector: '[bookappLazyImage]'
})
export class LazyImageDirective implements AfterViewInit {
  @Input() bookappLazyImage = '';

  private _intersectionObserver: IntersectionObserver;

  constructor(private readonly renderer: Renderer2, private readonly elem: ElementRef) {}

  ngAfterViewInit() {
    this._intersectionObserver = new IntersectionObserver(entries => {
      this.checkForIntersection(entries);
    }, OPTIONS);
    this._intersectionObserver.observe(this.elem.nativeElement);
  }

  private checkForIntersection(entries: IntersectionObserverEntry[]) {
    entries.forEach(entry => {
      if (this.checkIfIntersecting(entry)) {
        this.renderer.setProperty(this.elem.nativeElement, 'src', this.bookappLazyImage);
        this._intersectionObserver.unobserve(this.elem.nativeElement);
        this._intersectionObserver.disconnect();
      }
    });
  }

  private checkIfIntersecting(entry: IntersectionObserverEntry) {
    return entry.isIntersecting && entry.target === this.elem.nativeElement;
  }
}

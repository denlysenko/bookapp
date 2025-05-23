import { AfterViewInit, Directive, ElementRef, inject, input, Renderer2 } from '@angular/core';

const OPTIONS = {
  threshold: 0.25,
  rootMargin: '0px 0px 100px 0px',
};

@Directive({
  selector: '[bookappLazyImage]',
})
export class LazyImageDirective implements AfterViewInit {
  readonly bookappLazyImage = input('');

  readonly #renderer = inject(Renderer2);
  readonly #elem = inject(ElementRef);

  #intersectionObserver: IntersectionObserver;

  ngAfterViewInit() {
    this.#intersectionObserver = new IntersectionObserver((entries) => {
      this.#checkForIntersection(entries);
    }, OPTIONS);
    this.#intersectionObserver.observe(this.#elem.nativeElement);
  }

  #checkForIntersection(entries: IntersectionObserverEntry[]) {
    entries.forEach((entry) => {
      if (this.#checkIfIntersecting(entry)) {
        this.#renderer.setProperty(this.#elem.nativeElement, 'src', this.bookappLazyImage());
        this.#intersectionObserver.unobserve(this.#elem.nativeElement);
        this.#intersectionObserver.disconnect();
      }
    });
  }

  #checkIfIntersecting(entry: IntersectionObserverEntry) {
    return entry.isIntersecting && entry.target === this.#elem.nativeElement;
  }
}

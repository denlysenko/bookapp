import { AfterViewInit, Component, ElementRef, OnDestroy, output, viewChild } from '@angular/core';

@Component({
  selector: 'bookapp-infinite-scroll',
  template: `
    <ng-content />
    <div #anchor></div>
  `,
})
export class InfiniteScrollComponent implements AfterViewInit, OnDestroy {
  readonly scrolled = output<void>();

  readonly anchor = viewChild<ElementRef<HTMLElement>>('anchor');

  #observer: IntersectionObserver | null = null;

  ngAfterViewInit() {
    const options = {
      root: null,
    };

    this.#observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        this.scrolled.emit();
      }
    }, options);

    this.#observer.observe(this.anchor().nativeElement);
  }

  ngOnDestroy() {
    this.#observer.disconnect();
  }
}

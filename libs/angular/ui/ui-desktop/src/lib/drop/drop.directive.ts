import {
  Directive,
  ElementRef,
  inject,
  NgZone,
  OnDestroy,
  OnInit,
  output,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[bookappDrop]',
  host: {
    '(dragenter)': 'onDragEnter()',
    '(dragleave)': 'onDragLeave()',
    '(drop)': 'onDrop($event)',
  },
})
export class DropDirective implements OnInit, OnDestroy {
  readonly dropped = output<DragEvent>();

  readonly #elemRef = inject(ElementRef);
  readonly #renderer = inject(Renderer2);
  readonly #zone = inject(NgZone);

  #highlighted = false;
  #dragOverHandler: (event: Event) => void;

  ngOnInit() {
    if (!this.#dragOverHandler) {
      this.#zone.runOutsideAngular(() => {
        this.#dragOverHandler = (event) => {
          event.preventDefault();
        };

        this.#elemRef.nativeElement.addEventListener('dragover', this.#dragOverHandler);
      });
    }
  }

  onDragEnter() {
    this.#toggleHighlight();
  }

  onDragLeave() {
    this.#toggleHighlight();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.#toggleHighlight();
    this.dropped.emit(event);
  }

  ngOnDestroy() {
    if (this.#dragOverHandler) {
      this.#zone.runOutsideAngular(() => {
        this.#elemRef.nativeElement.removeEventListener('dragover', this.#dragOverHandler);
        this.#dragOverHandler = null;
      });
    }
  }

  #toggleHighlight() {
    this.#highlighted = !this.#highlighted;

    if (this.#highlighted) {
      this.#renderer.addClass(this.#elemRef.nativeElement, 'highlighted');
    } else {
      this.#renderer.removeClass(this.#elemRef.nativeElement, 'highlighted');
    }
  }
}

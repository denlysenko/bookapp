import { ChangeDetectionStrategy, Component, input, OnInit, output } from '@angular/core';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const ePubReader: any;

@Component({
  selector: 'bookapp-book-reader',
  templateUrl: './book-reader.component.html',
  styleUrls: ['./book-reader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookReaderComponent implements OnInit {
  readonly src = input<string>();
  readonly bookmark = input<string>();

  readonly locationChanged = output<string>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  #reader: any;

  ngOnInit() {
    this.#reader = ePubReader(this.src());

    if (this.bookmark()) {
      this.#reader.rendition.display(this.bookmark());
    }

    this.#reader.rendition.on('locationChanged', ({ start }) => {
      this.locationChanged.emit(start);
    });
  }
}

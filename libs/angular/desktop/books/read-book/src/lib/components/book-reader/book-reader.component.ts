import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

declare var ePubReader: any;

@Component({
  selector: 'bookapp-book-reader',
  templateUrl: './book-reader.component.html',
  styleUrls: ['./book-reader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookReaderComponent implements OnInit {
  @Input()
  src: string;

  @Input()
  bookmark: string;

  @Output()
  locationChanged = new EventEmitter<string>();

  private reader: any;

  ngOnInit() {
    this.reader = ePubReader(this.src);

    if (this.bookmark) {
      this.reader.rendition.display(this.bookmark);
    }

    this.reader.rendition.on('locationChanged', ({ start }) => {
      this.locationChanged.emit(start);
    });
  }
}

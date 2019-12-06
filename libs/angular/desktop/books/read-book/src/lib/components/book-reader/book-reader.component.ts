import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'bookapp-book-reader',
  templateUrl: './book-reader.component.html',
  styleUrls: ['./book-reader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookReaderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

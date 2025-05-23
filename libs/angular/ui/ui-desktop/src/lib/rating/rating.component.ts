import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  inject,
  OnInit,
  output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const RATING_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => RatingComponent),
  multi: true,
};

@Component({
  selector: 'bookapp-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
  providers: [RATING_CONTROL_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RatingComponent implements ControlValueAccessor, OnInit {
  readonly onHover = output<number>();
  readonly onLeave = output<number>();

  readonly #cdr = inject(ChangeDetectorRef);

  range: { index: number }[];
  value: number;

  #preValue: number;
  #max = 5;

  onChange: (value: number) => void = () => {
    //
  };
  onTouched: () => void = () => {
    //
  };

  ngOnInit() {
    this.range = this.#buildTemplateObjects(this.#max);
  }

  writeValue(value: number) {
    if (value % 1 !== value) {
      this.value = Math.round(value);
      this.#preValue = value;
      this.#cdr.markForCheck();

      return;
    }

    this.#preValue = value;
    this.value = value;
    this.#cdr.markForCheck();
  }

  enter(value: number) {
    this.value = value;
    this.#cdr.markForCheck();
    this.onHover.emit(value);
  }

  reset() {
    this.value = this.#preValue;
    this.#cdr.markForCheck();
    this.onLeave.emit(this.value);
  }

  registerOnChange(fn: (value: number) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  rate(value: number) {
    if (value >= 0 && value <= this.range.length) {
      this.writeValue(value);
      this.onChange(value);
    }
  }

  #buildTemplateObjects(max: number): { index: number }[] {
    const result: { index: number }[] = [];
    for (let i = 0; i < max; i++) {
      result.push({
        index: i,
      });
    }

    return result;
  }
}

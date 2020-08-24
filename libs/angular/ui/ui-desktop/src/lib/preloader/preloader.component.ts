import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'bookapp-preloader',
  templateUrl: './preloader.component.html',
  styleUrls: ['./preloader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreloaderComponent {
  @Input() visible: boolean;
}

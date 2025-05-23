import { MediaMatcher } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
  viewChild,
} from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';

import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';

import { MainLayoutBase } from '@bookapp/angular/base';

import { filter, takeUntil } from 'rxjs/operators';

import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { NavComponent } from '../../components/nav/nav.component';

@Component({
  imports: [
    AsyncPipe,
    RouterOutlet,
    MatSidenavModule,
    HeaderComponent,
    NavComponent,
    FooterComponent,
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent extends MainLayoutBase implements OnInit, OnDestroy {
  readonly sidenav = viewChild(MatSidenav);

  readonly #cdr = inject(ChangeDetectorRef);
  readonly #media: MediaMatcher = inject(MediaMatcher);
  readonly #router = inject(Router);

  readonly mobileQuery = this.#media.matchMedia('(max-width: 600px)');

  readonly #mobileQueryListener = () => this.#cdr.detectChanges();

  ngOnInit(): void {
    this.mobileQuery.addListener(this.#mobileQueryListener);

    this.#router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        if (this.mobileQuery.matches && this.sidenav()?.opened) {
          this.sidenav().close();
        }
      });
  }

  override ngOnDestroy() {
    this.mobileQuery.removeListener(this.#mobileQueryListener);
    super.ngOnDestroy();
  }
}

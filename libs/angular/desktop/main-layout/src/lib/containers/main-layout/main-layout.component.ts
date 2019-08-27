import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';

import { MainLayoutBase } from '@bookapp/angular/base';
import { AuthService, LogsService } from '@bookapp/angular/data-access';

@Component({
  selector: 'bookapp-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent extends MainLayoutBase implements OnDestroy {
  mobileQuery: MediaQueryList;

  private mobileQueryListener: () => void;

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly media: MediaMatcher,
    authService: AuthService,
    logsService: LogsService
  ) {
    super(authService, logsService);
    this.mobileQuery = this.media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => this.cdr.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);
  }

  ngOnDestroy() {
    this.mobileQuery.removeListener(this.mobileQueryListener);
    super.ngOnDestroy();
  }
}

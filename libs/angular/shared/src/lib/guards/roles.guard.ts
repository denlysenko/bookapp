import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route } from '@angular/router';

import { RouterExtensions } from '@bookapp/angular/core';
import { AuthService } from '@bookapp/angular/data-access';

import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable()
export class RolesGuard implements CanActivate, CanLoad {
  constructor(
    private readonly authService: AuthService,
    private readonly routerExtensions: RouterExtensions
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.hasRoles(route.data['roles']);
  }

  canLoad(route: Route): Observable<boolean> {
    return this.hasRoles(route.data['roles']);
  }

  private hasRoles(roles: string[]): Observable<boolean> {
    return this.authService.fetchMe().pipe(
      map(({ data }) => data.me),
      map((user) => {
        if (!user.roles.some((role) => roles.includes(role))) {
          this.routerExtensions.navigate(['']);
          return false;
        }

        return true;
      }),
      take(1)
    );
  }
}

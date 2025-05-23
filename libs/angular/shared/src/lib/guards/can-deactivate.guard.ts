import { Observable } from 'rxjs';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

export function canDeactivateGuard(component: CanComponentDeactivate) {
  return component.canDeactivate ? component.canDeactivate() : true;
}

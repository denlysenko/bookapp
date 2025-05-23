import { Injectable } from '@angular/core';

import { ApplicationStore } from '@bookapp/shared/services';

@Injectable({ providedIn: 'root' })
export class StoreService extends ApplicationStore {}

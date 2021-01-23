import { NgModule } from '@angular/core';

import { PaymentRequestService } from './services/payment-request.service';
import { RouterExtensions } from './services/router-extensions.service';
import { StoreService } from './services/store.service';

@NgModule({
  providers: [RouterExtensions, StoreService, PaymentRequestService],
})
export class CoreModule {}

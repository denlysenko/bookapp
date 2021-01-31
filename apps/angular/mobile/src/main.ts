import { registerElement, platformNativeScriptDynamic } from '@nativescript/angular';
import { CardView } from '@nstudio/nativescript-cardview';
import { StarRating } from '@triniwiz/nativescript-star-ratings';

import { AppModule } from './app/app.module';

registerElement('CardView', () => CardView);
registerElement('StarRating', () => StarRating);

platformNativeScriptDynamic().bootstrapModule(AppModule);

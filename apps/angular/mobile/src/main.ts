import {
  bootstrapApplication,
  registerElement,
  runNativeScriptAngularApp,
} from '@nativescript/angular';
import { PreviousNextView } from '@nativescript/iqkeyboardmanager';
import { CardView } from '@nstudio/nativescript-cardview';

import { StarRating } from '@triniwiz/nativescript-star-ratings';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { PlainButton } from './app/custom-elements/plain-button';

registerElement('CardView', () => CardView);
registerElement('StarRating', () => StarRating);
registerElement('PreviousNextView', () => PreviousNextView);
registerElement('Button', () => PlainButton);

runNativeScriptAngularApp({
  appModuleBootstrap: () => bootstrapApplication(AppComponent, appConfig),
});

/**
 * If ios build fails, add to platforms/ios/Podfile:
 * post_install do |installer|
 *   installer.pods_project.targets.each do |target|
 *     target.build_configurations.each do |config|
 *       config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '13.0'
 *     end
 *   end
 * end
 * 
 * and in XCode: In the "General" tab, set the "Deployment Info" > "iOS Deployment Target" to at least iOS 13.0 (or higher)

 */

/*
 * For Android nativescript-feedback
 * https://stackoverflow.com/a/79202870
 */

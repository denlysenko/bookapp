import { LoadingIndicator } from '@nstudio/nativescript-loading-indicator';

export class LoaderService {
  private loader: LoadingIndicator;

  constructor() {
    this.loader = new LoadingIndicator();
  }

  start() {
    const options = {
      dimBackground: true,
      color: '#9ca5b9',
      backgroundColor: '#2f364a',
    };

    this.loader.show(options);
  }

  stop() {
    this.loader.hide();
  }
}

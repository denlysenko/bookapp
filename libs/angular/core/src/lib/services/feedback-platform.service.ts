export abstract class FeedbackPlatformService {
  abstract success(msg: string): void;
  abstract error(msg: string): void;
}

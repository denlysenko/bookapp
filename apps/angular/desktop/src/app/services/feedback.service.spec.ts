import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FeedbackService } from './feedback.service';

const SUCCESS_MSG = 'Success';
const ERROR_MSG = 'Error';

describe('FeedbackService', () => {
  let service: FeedbackService;
  let snackBar: MatSnackBar;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FeedbackService,
        {
          provide: MatSnackBar,
          useValue: {
            open: jest.fn()
          }
        }
      ]
    });

    service = TestBed.get(FeedbackService);
    snackBar = TestBed.get(MatSnackBar);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('success()', () => {
    it('should open snack bar with success message', () => {
      service.success(SUCCESS_MSG);
      expect(snackBar.open).toHaveBeenCalledWith(SUCCESS_MSG);
    });
  });

  describe('error()', () => {
    it('should open snack bar with error message', () => {
      service.error(ERROR_MSG);
      expect(snackBar.open).toHaveBeenCalledWith(ERROR_MSG);
    });
  });
});

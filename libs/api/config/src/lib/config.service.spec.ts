import { MockConfigService } from '@bookapp/testing';

import { Test } from '@nestjs/testing';

import { ConfigService } from './config.service';

describe('ConfigService', () => {
  let configService: ConfigService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: ConfigService,
          useValue: MockConfigService
        }
      ]
    }).compile();

    configService = module.get<ConfigService>(ConfigService);
  });

  describe('get()', () => {
    it('should return config value', () => {
      const value = 'envConfig';
      expect(configService.get(value)).toEqual(value);
    });
  });
});

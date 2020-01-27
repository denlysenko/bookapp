import { PUB_SUB } from '@bookapp/api/graphql';
import { ApiQuery, ModelNames } from '@bookapp/api/shared';
import { log, MockConfigService, MockModel, MockMongooseModel } from '@bookapp/testing';

import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';

import { PubSub } from 'graphql-subscriptions';

import { LogsService } from './logs.service';

describe('LogsService', () => {
  let logsService: LogsService;
  let configService: ConfigService;
  let logModel: any;
  let pubSub: PubSub;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        LogsService,
        {
          provide: ConfigService,
          useValue: MockConfigService
        },
        {
          provide: getModelToken(ModelNames.LOG),
          useValue: MockModel
        },
        {
          provide: PUB_SUB,
          useValue: {
            publish: jest.fn()
          }
        }
      ]
    }).compile();

    logsService = module.get<LogsService>(LogsService);
    configService = module.get<ConfigService>(ConfigService);
    logModel = module.get(getModelToken(ModelNames.LOG));
    pubSub = module.get<PubSub>(PUB_SUB);

    jest.spyOn(logModel, 'exec').mockImplementation(() => Promise.resolve(MockMongooseModel));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll()', () => {
    beforeEach(() => {
      jest.spyOn(logModel, 'exec').mockImplementation(() => Promise.resolve(1));
    });

    it('should count logs', async () => {
      await logsService.findAll(new ApiQuery());
      expect(logModel.countDocuments).toHaveBeenCalled();
    });

    it('should find logs for particular userId', async () => {
      await logsService.findAll(new ApiQuery({ userId: 'user_id' }));
      expect(logModel.find).toHaveBeenCalledWith({ userId: 'user_id' });
    });

    it('should skip with default value', async () => {
      await logsService.findAll(new ApiQuery());
      expect(logModel.skip).toHaveBeenCalledWith(0);
    });

    it('should skip with value from query', async () => {
      await logsService.findAll(new ApiQuery(null, null, 10));
      expect(logModel.skip).toHaveBeenCalledWith(10);
    });

    it('should limit with default value', async () => {
      jest.spyOn(configService, 'get').mockReturnValue('5');
      await logsService.findAll(new ApiQuery());
      expect(logModel.limit).toHaveBeenCalledWith(5);
    });

    it('should limit with value from query', async () => {
      await logsService.findAll(new ApiQuery(null, 10, null));
      expect(logModel.limit).toHaveBeenCalledWith(10);
    });

    it('should sort without value from query', async () => {
      await logsService.findAll(new ApiQuery());
      expect(logModel.sort).toHaveBeenCalledWith(null);
    });

    it('should sort with value from query', async () => {
      const order = { test: -1 };
      await logsService.findAll(new ApiQuery(null, null, null, order));
      expect(logModel.sort).toHaveBeenCalledWith(order);
    });
  });

  describe('create()', () => {
    it('should create log', async () => {
      await logsService.create(log);
      expect(logModel.save).toHaveBeenCalled();
    });

    it('should reject log creation', async () => {
      const error = { message: 'error' };

      jest.spyOn(logModel, 'save').mockImplementationOnce(() => Promise.reject(error));

      try {
        await logsService.create(log);
      } catch (err) {
        expect(err).toEqual(error);
      }
    });

    it('should publish event', async () => {
      await logsService.create(log);
      expect(pubSub.publish).toHaveBeenCalled();
    });
  });
});

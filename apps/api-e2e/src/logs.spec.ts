import { AuthModule } from '@bookapp/api/auth';
import { GraphqlModule } from '@bookapp/api/graphql';
import { LogsModule, LogsService } from '@bookapp/api/logs';
import { ModelNames } from '@bookapp/api/shared';
import { UsersService } from '@bookapp/api/users';
import {
  log,
  MockConfigService,
  mockConnection,
  MockLogsService,
  MockModel,
  user,
} from '@bookapp/testing/api';

import { INestApplication } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getConnectionToken, getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';

import jwt from 'jsonwebtoken';
import request from 'supertest';

const authToken = jwt.sign({ id: user.id }, 'ACCESS_TOKEN_SECRET');

describe('LogsModule', () => {
  let app: INestApplication;
  let logsService: LogsService;
  let usersService: UsersService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        LogsModule,
        AuthModule,
        GraphqlModule,
        MongooseModule.forRoot('test'),
      ],
    })
      .overrideProvider(getConnectionToken())
      .useValue(mockConnection)
      .overrideProvider(getModelToken(ModelNames.AUTH_TOKEN))
      .useValue(MockModel)
      .overrideProvider(ConfigService)
      .useValue(MockConfigService)
      .overrideProvider(getModelToken(ModelNames.LOG))
      .useValue(MockModel)
      .overrideProvider(getModelToken(ModelNames.USER))
      .useValue(MockModel)
      .overrideProvider(getModelToken(ModelNames.PASSKEY))
      .useValue(MockModel)
      .overrideProvider(LogsService)
      .useValue(MockLogsService)
      .compile();

    logsService = module.get<LogsService>(LogsService);
    usersService = module.get<UsersService>(UsersService);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jest.spyOn(usersService, 'findById').mockResolvedValue(user as any);

    app = module.createNestApplication();
    await app.init();
  });

  describe('getLogs()', () => {
    it('should get logs', async () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `query {
            logs {
              rows {
                id
              }
            }
          }`,
        })
        .expect({
          data: {
            logs: {
              rows: [
                {
                  id: log.id,
                },
              ],
            },
          },
        });
    });

    it('should skip logs', async () => {
      await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `query {
            logs(skip: 10) {
              rows {
                id
              }
            }
          }`,
        });

      expect(logsService.findAll).toHaveBeenCalledWith({
        filter: { userId: 'id' },
        first: null,
        order: null,
        skip: 10,
      });
    });

    it('should limit logs', async () => {
      await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `query {
            logs(first: 10) {
              rows {
                id
              }
            }
          }`,
        });

      expect(logsService.findAll).toHaveBeenCalledWith({
        filter: { userId: 'id' },
        first: 10,
        order: null,
        skip: null,
      });
    });

    it('should order logs', async () => {
      await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `query {
            logs(orderBy: createdAt_asc) {
              rows {
                id
              }
            }
          }`,
        });

      expect(logsService.findAll).toHaveBeenCalledWith({
        filter: { userId: 'id' },
        first: null,
        order: { createdAt: 'asc' },
        skip: null,
      });
    });

    it('should return UNAUTHENTICATED error', async () => {
      const res = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `query {
            logs {
              rows {
                id
              }
            }
          }`,
        });

      const [error] = res.body.errors;
      expect(error.extensions.code).toEqual('UNAUTHENTICATED');
    });
  });

  afterAll(async () => {
    await app.close();
  });
});

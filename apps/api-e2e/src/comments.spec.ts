import { AuthModule } from '@bookapp/api/auth';
import { CommentsModule, CommentsService } from '@bookapp/api/comments';
import { GraphqlModule } from '@bookapp/api/graphql';
import { ModelNames } from '@bookapp/api/shared';
import { UsersService } from '@bookapp/api/users';
import { comment, MockConfigService, mockConnection, MockModel, user } from '@bookapp/testing/api';

import { INestApplication } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getConnectionToken, getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';

import jwt from 'jsonwebtoken';
import request from 'supertest';

const authToken = jwt.sign({ id: user.id }, 'ACCESS_TOKEN_SECRET');

const MockCommentsService = {
  saveForBook: jest.fn().mockResolvedValue(comment),
};

describe('CommentsModule', () => {
  let app: INestApplication;
  let usersService: UsersService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        AuthModule,
        GraphqlModule,
        CommentsModule,
        MongooseModule.forRoot('test'),
      ],
    })
      .overrideProvider(getConnectionToken())
      .useValue(mockConnection)
      .overrideProvider(getModelToken(ModelNames.AUTH_TOKEN))
      .useValue(MockModel)
      .overrideProvider(getModelToken(ModelNames.COMMENT))
      .useValue(MockModel)
      .overrideProvider(getModelToken(ModelNames.USER))
      .useValue(MockModel)
      .overrideProvider(getModelToken(ModelNames.LOG))
      .useValue(MockModel)
      .overrideProvider(ConfigService)
      .useValue(MockConfigService)
      .overrideProvider(CommentsService)
      .useValue(MockCommentsService)
      .compile();

    usersService = module.get<UsersService>(UsersService);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jest.spyOn(usersService, 'findById').mockResolvedValue(user as any);

    app = module.createNestApplication();
    await app.init();
  });

  describe('addComment()', () => {
    it('should add comment for book', async () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `mutation {
            addComment(bookId: "book_id", text: "test comment") {
              id
            }
          }`,
        })
        .expect({
          data: {
            addComment: {
              id: comment.id,
            },
          },
        });
    });

    it('should return UNAUTHENTICATED error', async () => {
      const res = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation {
            addComment(bookId: "book_id", text: "test comment") {
              id
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

import { AuthModule, AuthService } from '@bookapp/api/auth';
import {
  COMMENT_MODEL_NAME,
  CommentsModule,
  CommentsService
} from '@bookapp/api/comments';
import { ConfigModule, ConfigService } from '@bookapp/api/config';
import { GraphqlModule } from '@bookapp/api/graphql';
import { LOG_MODEL_NAME } from '@bookapp/api/logs';
import { USER_MODEL_NAME } from '@bookapp/api/users';
import { ROLES } from '@bookapp/shared/models';
import { comment, MockConfigService, MockModel, user } from '@bookapp/testing';

import { HttpStatus, INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';

import * as jwt from 'jsonwebtoken';
import * as request from 'supertest';

const authToken = jwt.sign({ id: user._id }, 'JWT_SECRET');

const MockCommentsService = {
  saveForBook: jest.fn().mockResolvedValue(comment)
};

describe('CommentsModule', () => {
  let app: INestApplication;
  let commentsService: CommentsService;
  let authService: AuthService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [ConfigModule, AuthModule, GraphqlModule, CommentsModule]
    })
      .overrideProvider(getModelToken(COMMENT_MODEL_NAME))
      .useValue(MockModel)
      .overrideProvider(getModelToken(USER_MODEL_NAME))
      .useValue(MockModel)
      .overrideProvider(getModelToken(LOG_MODEL_NAME))
      .useValue(MockModel)
      .overrideProvider(ConfigService)
      .useValue(MockConfigService)
      .overrideProvider(CommentsService)
      .useValue(MockCommentsService)
      .compile();

    commentsService = module.get<CommentsService>(CommentsService);
    authService = module.get<AuthService>(AuthService);

    jest.spyOn(authService, 'validate').mockResolvedValue({
      ...user,
      roles: [ROLES.ADMIN]
    } as any);

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
              _id
            }
          }`
        })
        .expect({
          data: {
            addComment: {
              _id: comment._id
            }
          }
        });
    });

    it('should return UNAUTHORIZED error', async () => {
      const res = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation {
            addComment(bookId: "book_id", text: "test comment") {
              _id
            }
          }`
        });

      const [error] = res.body.errors;

      expect(error.message).toEqual({
        statusCode: HttpStatus.UNAUTHORIZED,
        error: 'Unauthorized'
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});

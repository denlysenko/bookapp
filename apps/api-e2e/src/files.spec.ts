import { AuthModule } from '@bookapp/api/auth';
import { AuthTokensService } from '@bookapp/api/auth-tokens';
import { FILE_ERRORS, FilesModule, FilesService } from '@bookapp/api/files';
import { ModelNames } from '@bookapp/api/shared';
import { UsersService } from '@bookapp/api/users';
import { MockAuthTokensService, MockConfigService, MockModel, user } from '@bookapp/testing/api';

import { HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';

import jwt from 'jsonwebtoken';
import { resolve } from 'node:path';
import request from 'supertest';

const authToken = jwt.sign({ id: user.id }, 'ACCESS_TOKEN_SECRET');
const publicUrl = 'public_url';
const filesPath = resolve(`${__dirname}`, '../test-files');

const MockFilesService = {
  uploadToBucket: jest.fn().mockImplementation(() => Promise.resolve({ publicUrl })),
  deleteFromBucket: jest.fn().mockImplementation(() => Promise.resolve()),
};

describe('FilesModule', () => {
  let app: INestApplication;
  let usersService: UsersService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        AuthModule,
        FilesModule,
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(MockConfigService)
      .overrideProvider(getModelToken(ModelNames.USER))
      .useValue(MockModel)
      .overrideProvider(getModelToken(ModelNames.AUTH_TOKEN))
      .useValue(MockModel)
      .overrideProvider(getModelToken(ModelNames.PASSKEY))
      .useValue(MockModel)
      .overrideProvider(FilesService)
      .useValue(MockFilesService)
      .overrideProvider(AuthTokensService)
      .useValue(MockAuthTokensService)
      .compile();

    usersService = module.get<UsersService>(UsersService);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jest.spyOn(usersService, 'findById').mockResolvedValue(user as any);

    app = module.createNestApplication();
    await app.init();
  });

  describe('POST /files', () => {
    it('should upload JPEG file', async () => {
      return request(app.getHttpServer())
        .post('/files')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('file', `${filesPath}/JPEG.jpg`)
        .expect(HttpStatus.OK)
        .expect({ publicUrl });
    });

    it('should upload PNG file', async () => {
      return request(app.getHttpServer())
        .post('/files')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('file', `${filesPath}/PNG.png`)
        .expect(HttpStatus.OK)
        .expect({ publicUrl });
    });

    it('should upload EPUB file', async () => {
      return request(app.getHttpServer())
        .post('/files')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('file', `${filesPath}/EPUB.epub`)
        .expect(HttpStatus.OK)
        .expect({ publicUrl });
    });

    it('should not upload PDF file', async () => {
      return request(app.getHttpServer())
        .post('/files')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('file', `${filesPath}/PDF.pdf`)
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: HttpStatus.BAD_REQUEST,
          error: 'Bad Request',
          message: FILE_ERRORS.INVALID_MIMETYPE_ERR,
        });
    });

    it('should return UNAUTHORIZED error', async () => {
      return request(app.getHttpServer()).post('/files').expect(HttpStatus.UNAUTHORIZED).expect({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Unauthorized',
      });
    });
  });

  describe('DELETE /files/:id', () => {
    const fileId = 'file_id';

    it('should remove file', async () => {
      return request(app.getHttpServer())
        .delete(`/files/${fileId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK);
    });

    it('should return UNAUTHORIZED error', async () => {
      return request(app.getHttpServer())
        .delete(`/files/${fileId}`)
        .expect(HttpStatus.UNAUTHORIZED)
        .expect({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Unauthorized',
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});

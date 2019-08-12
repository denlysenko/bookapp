import { AuthModule, AuthService } from '@bookapp/api/auth';
import { ConfigModule, ConfigService } from '@bookapp/api/config';
import { FILE_ERRORS, FilesModule, FilesService } from '@bookapp/api/files';
import { USER_MODEL_NAME } from '@bookapp/api/users';
import { MockConfigService, MockModel, user } from '@bookapp/testing';

import { HttpStatus, INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';

import * as jwt from 'jsonwebtoken';
import { resolve } from 'path';
import * as request from 'supertest';

const authToken = jwt.sign({ id: user._id }, 'JWT_SECRET');
const publicUrl = 'public_url';
const filesPath = resolve(`${__dirname}`, '../test-files');

const MockFilesService = {
  uploadToBucket: jest
    .fn()
    .mockImplementation(() => Promise.resolve({ publicUrl })),
  deleteFromBucket: jest.fn().mockImplementation(() => Promise.resolve())
};

describe('FilesModule', () => {
  let app: INestApplication;
  let filesService: FilesService;
  let authService: AuthService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [ConfigModule, AuthModule, FilesModule]
    })
      .overrideProvider(ConfigService)
      .useValue(MockConfigService)
      .overrideProvider(getModelToken(USER_MODEL_NAME))
      .useValue(MockModel)
      .overrideProvider(FilesService)
      .useValue(MockFilesService)
      .compile();

    filesService = module.get<FilesService>(FilesService);
    authService = module.get<AuthService>(AuthService);

    jest.spyOn(authService, 'validate').mockResolvedValue(user as any);

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
          message: FILE_ERRORS.INVALID_MIMETYPE_ERR
        });
    });

    it('should return UNAUTHORIZED error', async () => {
      return request(app.getHttpServer())
        .post('/files')
        .expect(HttpStatus.UNAUTHORIZED)
        .expect({
          statusCode: HttpStatus.UNAUTHORIZED,
          error: 'Unauthorized'
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
          error: 'Unauthorized'
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});

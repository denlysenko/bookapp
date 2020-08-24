import { UploadResponse } from '@bookapp/shared';

import { Bucket, Storage } from '@google-cloud/storage';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { format } from 'util';

@Injectable()
export class FilesService {
  private bucket: Bucket;

  constructor(configService: ConfigService) {
    this.bucket = new Storage({
      projectId: configService.get('FIREBASE_PROJECT_ID'),
      keyFilename: configService.get('FIREBASE_KEY_FILENAME'),
    }).bucket(configService.get('FIREBASE_BUCKET_URL'));
  }

  uploadToBucket(file: any, filename: string): Promise<UploadResponse> {
    return new Promise((resolve, reject) => {
      const blob = this.bucket.file(filename);

      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: file.mimetype,
          cacheControl: 'max-age=31536000',
        },
      });

      blobStream.on('error', (error) => {
        reject(error);
      });

      blobStream.on('finish', () => {
        const publicUrl = format(
          // tslint:disable-next-line: prettier
          `https://firebasestorage.googleapis.com/v0/b/${this.bucket.name}/o/${blob.name}?alt=media`
        );
        resolve({ publicUrl });
      });

      blobStream.end(file);
    });
  }

  deleteFromBucket(key: string): Promise<any> {
    return this.bucket.file(key).delete();
  }
}

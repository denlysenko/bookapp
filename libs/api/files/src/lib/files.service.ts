import { UploadResponse } from '@bookapp/shared/interfaces';

import { Bucket, Storage } from '@google-cloud/storage';

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { format } from 'util';

@Injectable()
export class FilesService {
  private bucket: Bucket;
  private readonly logger = new Logger(FilesService.name);

  constructor(configService: ConfigService) {
    this.bucket = new Storage({
      projectId: configService.get('FIREBASE_PROJECT_ID'),
      keyFilename: configService.get('FIREBASE_KEY_FILENAME'),
    }).bucket(configService.get('FIREBASE_BUCKET_URL'));
  }

  uploadToBucket(file: Express.Multer.File, filename: string): Promise<UploadResponse> {
    return new Promise((resolve, reject) => {
      const blob = this.bucket.file(filename);

      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: file.mimetype,
          cacheControl: 'max-age=31536000',
        },
      });

      blobStream.on('error', (error) => {
        this.logger.error(`Error uploading file to bucket: ${error}`);
        reject(error);
      });

      blobStream.on('finish', () => {
        const publicUrl = format(
          `https://firebasestorage.googleapis.com/v0/b/${this.bucket.name}/o/${blob.name}?alt=media`
        );
        this.logger.log(`File uploaded to bucket: ${publicUrl}`);
        resolve({ publicUrl });
      });

      blobStream.end(file.buffer);
    });
  }

  async deleteFromBucket(key: string): Promise<void> {
    await this.bucket.file(key).delete();
    this.logger.log(`File deleted from bucket: ${key}`);
  }
}

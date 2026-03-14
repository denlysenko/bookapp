import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

import * as multer from 'multer';
import { randomUUID } from 'node:crypto';
import { extname } from 'node:path';

import { UPLOAD_FOLDERS } from '@bookapp/shared/constants';

import { FILE_ERRORS } from './constants';
import { FilesService } from './files.service';

function fileFilter(_: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  if (
    !file.mimetype.includes('jpeg') &&
    !file.mimetype.includes('png') &&
    !file.mimetype.includes('epub')
  ) {
    return cb(null, false);
  }
  cb(null, true);
}

const options = { fileFilter, limits: { fileSize: 10000000 } };

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file', options))
  @HttpCode(HttpStatus.OK)
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Body('folder') folder?: string) {
    if (!file) {
      throw new BadRequestException(FILE_ERRORS.INVALID_MIMETYPE_ERR);
    }

    if (folder !== undefined && !(Object.values(UPLOAD_FOLDERS) as string[]).includes(folder)) {
      throw new BadRequestException(FILE_ERRORS.INVALID_FOLDER_ERR);
    }

    const uuid = `${randomUUID()}${extname(file.originalname)}`;
    const filename = folder ? `${folder}/${uuid}` : uuid;
    return this.filesService.uploadToBucket(file, filename);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async deleteFile(@Param('id') key: string) {
    return this.filesService.deleteFromBucket(key);
  }
}

import { ConfigService } from '@bookapp/api/config';
import { PUB_SUB } from '@bookapp/api/graphql';
import { ApiQuery } from '@bookapp/api/shared';
import { ApiResponse } from '@bookapp/shared/models';

import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { PubSub } from 'graphql-subscriptions';
import { Model } from 'mongoose';

import { LOG_MODEL_NAME } from './constants';
import { LogDto } from './dto/log';
import { LogModel } from './interfaces/log';

@Injectable()
export class LogsService {
  constructor(
    @InjectModel(LOG_MODEL_NAME) private readonly logModel: Model<LogModel>,
    private readonly configService: ConfigService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub
  ) {}

  async create(logDto: LogDto): Promise<LogModel> {
    const createdLog = new this.logModel(logDto);
    await createdLog.save();
    this.pubSub.publish('logCreated', { logCreated: createdLog });
    return createdLog;
  }

  async findAll(query?: ApiQuery): Promise<ApiResponse<LogModel>> {
    const { filter, skip, first, order } = query;
    const where = filter || {};
    const count = await this.logModel.countDocuments(where).exec();
    const rows = await this.logModel
      .find(where)
      .skip(skip || 0)
      .limit(first || parseInt(this.configService.get('DEFAULT_LIMIT'), 10))
      .sort(order)
      .exec();

    return {
      count,
      rows
    };
  }
}

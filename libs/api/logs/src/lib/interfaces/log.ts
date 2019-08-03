import { Log } from '@bookapp/shared/models';
import { Document } from 'mongoose';

export interface LogModel extends Log, Document {}

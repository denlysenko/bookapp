import { Log } from '@bookapp/shared';
import { Document } from 'mongoose';

export interface LogModel extends Log, Document {}

import { FilterInput } from '@bookapp/api/shared';

export interface BookFilterInput extends FilterInput {
  paid: boolean;
}

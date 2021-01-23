import { isNil } from 'lodash';

export function formatCurrency(value: number): string {
  return !isNil(value)
    ? value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    : value;
}

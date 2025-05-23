export function convertToMongoSortQuery(orderString): { [key: string]: 'asc' | 'desc' } {
  // ex. id_asc or id_desc
  // desc: -1 { id: -1 }
  const [field, direction] = orderString.split('_');
  return {
    [field]: direction,
  };
}

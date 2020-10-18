export function convertToMongoSortQuery(orderString): { [key: string]: number } {
  // ex. id_asc or id_desc
  // desc: -1 { id: -1 }
  const parts = orderString.split('_');
  return {
    [parts[0]]: parts[1] === 'desc' ? -1 : 1,
  };
}

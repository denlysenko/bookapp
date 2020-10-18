export function extractFileKey(fileUrl: string): string {
  const splitted = fileUrl.split('/'); // take last part of uri as a key

  let key = splitted[splitted.length - 1];

  const idx = key.indexOf('?');

  if (idx > -1) {
    key = key.slice(0, idx);
  }

  return key;
}

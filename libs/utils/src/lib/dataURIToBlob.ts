export function dataURIToBlob(dataURI: string): Blob {
  // convert base64/URLEncoded data component to raw binary data held in a string
  const byteString =
    dataURI.split(',')[0].indexOf('base64') >= 0
      ? atob(dataURI.split(',')[1])
      : decodeURIComponent(dataURI.split(',')[1]);

  // write the bytes of the string to a typed array
  const ia = new Uint8Array(byteString.length);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  // separate out the mime component
  const type = dataURI
    .split(',')[0]
    .split(':')[1]
    .split(';')[0];

  return new Blob([ia], { type });
}

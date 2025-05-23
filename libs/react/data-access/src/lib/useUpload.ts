import { useState } from 'react';

import { store } from '@bookapp/react/core';
import { AUTH_TOKEN, HTTP_STATUS } from '@bookapp/shared/constants';
import { environment } from '@bookapp/shared/environments';

export function useUpload() {
  const [progress, setProgress] = useState(0);

  const uploadFile = (file: File | Blob, name = 'file'): Promise<string> => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      const xhr = new XMLHttpRequest();

      formData.append(name, file);

      if (xhr.upload) {
        xhr.upload.addEventListener(
          'progress',
          (e: ProgressEvent) => {
            if (e.lengthComputable) {
              setProgress(Math.round((e.loaded * 100) / e.total));
            }
          },
          false
        );
      }

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          setProgress(0);

          if (xhr.status === HTTP_STATUS.OK || xhr.status === HTTP_STATUS.CREATED) {
            resolve(xhr.response);
          } else {
            reject(xhr.response);
          }
        }
      };

      const token = store.get(AUTH_TOKEN);

      xhr.open('POST', `${environment.uploadUrl}`, true);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.send(formData);
    });
  };

  const deleteFile = (key: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === HTTP_STATUS.OK || xhr.status === HTTP_STATUS.CREATED) {
            resolve(xhr.response);
          } else {
            reject(xhr.response);
          }
        }
      };

      const token = store.get(AUTH_TOKEN);

      xhr.open('DELETE', `${environment.uploadUrl}/${key}`, true);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.send();
    });
  };

  return {
    progress,
    uploadFile,
    deleteFile,
  };
}

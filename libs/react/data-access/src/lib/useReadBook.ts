import { useEffect } from 'react';

import { useLazyQuery, useMutation } from '@apollo/client';

import { Book, Reading, User } from '@bookapp/shared/interfaces';
import { BOOK_QUERY, ME_QUERY, UPDATE_USER_MUTATION } from '@bookapp/shared/queries';

import { useMe } from './useMe';

export function useReadBook(slug?: string) {
  const [fetchBook, { data, loading }] = useLazyQuery<{ book: Book }>(BOOK_QUERY);
  const [executeUpdateMutation] = useMutation<{ updateUser: User }>(UPDATE_USER_MUTATION);
  const { me } = useMe();

  useEffect(() => {
    if (slug) {
      fetchBook({
        variables: { slug },
      });
    }
  }, [fetchBook, slug]);

  async function saveReading(reading: Reading) {
    await executeUpdateMutation({
      variables: {
        id: me.id,
        user: { reading },
      },
      update: (store, { data: { updateUser } }) => {
        const data: { me: User } = store.readQuery({
          query: ME_QUERY,
        });

        store.writeQuery({
          query: ME_QUERY,
          data: {
            me: {
              ...data.me,
              reading: updateUser.reading,
            },
          },
        });
      },
    });
  }

  return {
    loading,
    epubUrl: slug ? data && data.book && data.book.epubUrl : me.reading.epubUrl,
    bookmark: slug ? null : me.reading.bookmark,
    saveReading,
  };
}

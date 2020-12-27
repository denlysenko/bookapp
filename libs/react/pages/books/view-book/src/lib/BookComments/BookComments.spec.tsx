import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import { comment } from '@bookapp/testing';

import BookComments from './BookComments';

const onCommentAdd = jest.fn();

describe('BookComments', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <BookComments comments={[comment]} loading={false} onCommentAdd={onCommentAdd} />
    );
    expect(baseElement).toBeTruthy();
  });

  it('should render comments', () => {
    const { getAllByTestId } = render(
      <BookComments comments={[comment]} loading={false} onCommentAdd={onCommentAdd} />
    );
    expect(getAllByTestId('comment')).toHaveLength(1);
  });

  it('should render No comments text', () => {
    const { queryAllByTestId, getByText } = render(
      <BookComments comments={[]} loading={false} onCommentAdd={onCommentAdd} />
    );
    expect(queryAllByTestId('comment')).toHaveLength(0);
    expect(getByText('No comments yet')).toBeInTheDocument();
  });

  describe('handleSubmit', () => {
    it('should not call onCommentAdd if text is empty', async () => {
      const { getByPlaceholderText, getByRole } = render(
        <BookComments comments={[comment]} loading={false} onCommentAdd={onCommentAdd} />
      );

      fireEvent.change(getByPlaceholderText('Write a short comment...'), {
        target: {
          value: '',
        },
      });

      fireEvent.click(getByRole('button', { name: /submit comment/i }));

      expect(onCommentAdd).toHaveBeenCalledTimes(0);
    });

    it('should call onCommentAdd if text is empty', async () => {
      const text = 'a short comment';
      const { getByPlaceholderText, getByRole } = render(
        <BookComments comments={[comment]} loading={false} onCommentAdd={onCommentAdd} />
      );

      fireEvent.change(getByPlaceholderText('Write a short comment...'), {
        target: {
          value: text,
        },
      });

      fireEvent.click(getByRole('button', { name: /submit comment/i }));

      expect(onCommentAdd).toHaveBeenCalledTimes(1);
      expect(onCommentAdd).toHaveBeenCalledWith(text);
    });
  });
});

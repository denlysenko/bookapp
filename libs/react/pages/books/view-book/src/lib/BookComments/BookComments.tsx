import React, { memo, useState } from 'react';

import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { Comment } from '@bookapp/shared/interfaces';
import { formatDate } from '@bookapp/utils/react';

import { StyledBookComments } from './StyledBookComments';

export interface BookCommentsProps {
  comments: Comment[];
  loading: boolean;
  onCommentAdd: (text: string) => void;
}

export function BookComments({ comments = [], loading, onCommentAdd }: BookCommentsProps) {
  const [text, setText] = useState('');

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setText(value);
  };

  const handleSubmit = () => {
    if (text) {
      onCommentAdd(text);
      setText('');
    }
  };

  return (
    <StyledBookComments>
      <Typography variant="h4">Comments</Typography>
      {comments.length > 0 && (
        <List className="comments">
          {comments.map((comment) => (
            <ListItem key={comment.id} data-testid="comment">
              <ListItemText>
                <div>
                  <Typography variant="body1" component="span" className="author">
                    {comment.author.displayName}
                  </Typography>
                  <Typography variant="body1" component="span" className="metadata">
                    {formatDate(comment.createdAt)}
                  </Typography>
                </div>
                <Typography variant="body1" component="p" className="text">
                  {comment.text}
                </Typography>
              </ListItemText>
            </ListItem>
          ))}
        </List>
      )}
      {comments.length === 0 && (
        <Typography variant="body1" component="p">
          No comments yet
        </Typography>
      )}
      <h4>Submit a Comment</h4>
      <TextField
        placeholder="Write a short comment..."
        variant="outlined"
        multiline={true}
        minRows={4}
        maxRows={12}
        value={text}
        onChange={handleTextChange}
        data-testid="comment-input"
      />
      <CardActions>
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          disabled={loading}
          onClick={handleSubmit}
          data-testid="submit-comment"
        >
          Submit comment
        </Button>
      </CardActions>
    </StyledBookComments>
  );
}

export default memo(BookComments);

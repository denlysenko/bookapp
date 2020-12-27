import React, { memo, useState } from 'react';

import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { Comment } from '@bookapp/shared/interfaces';

import { useBookCommentsStyles } from './useBookCommentsStyles';

export interface BookCommentsProps {
  comments: Comment[];
  loading: boolean;
  onCommentAdd: (text: string) => void;
}

export function BookComments({ comments = [], loading, onCommentAdd }: BookCommentsProps) {
  const classes = useBookCommentsStyles();

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
    <div className={classes.root}>
      <Typography variant="h4">Comments</Typography>
      {comments.length > 0 && (
        <List className="comments">
          {comments.map((comment) => (
            <ListItem key={comment._id} data-testid="comment">
              <ListItemText>
                <div>
                  <Typography variant="body1" component="span" className="author">
                    {comment.author.displayName}
                  </Typography>
                  <Typography variant="body1" component="span" className="metadata">
                    {comment.createdAt}
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
        rows={4}
        rowsMax={12}
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
          SUBMIT COMMENT
        </Button>
      </CardActions>
    </div>
  );
}

export default memo(BookComments);

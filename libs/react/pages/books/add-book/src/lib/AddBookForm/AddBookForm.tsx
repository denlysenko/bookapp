import React, { useEffect } from 'react';

import { useFormik } from 'formik';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';

import { has, isEmpty, omit } from 'lodash-es';
import * as Yup from 'yup';

import { FileSelector, ImageSelector, useFileSelector, useImageSelector } from '@bookapp/react/ui';
import { ERRORS } from '@bookapp/shared/constants';
import { Book, BookFormModel } from '@bookapp/shared/interfaces';
import { getFormikError, handleValidationError } from '@bookapp/utils/react';

import { StyledAddBookForm } from './StyledAddBookForm';

export interface AddBookFormProps {
  loading: boolean;
  book?: Book;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any | null;
  onSubmit: (book: BookFormModel) => void;
}

const BookSchema = Yup.object().shape({
  title: Yup.string().required(ERRORS.REQUIRED_FIELD),
  author: Yup.string().required(ERRORS.REQUIRED_FIELD),
  description: Yup.string().required(ERRORS.REQUIRED_FIELD),
});

export const AddBookForm = ({ book, loading, error, onSubmit }: AddBookFormProps) => {
  const { isImageSelectorOpened, showImageSelector, hideImageSelector } = useImageSelector();
  const { isFileSelectorOpened, showFileSelector, hideFileSelector } = useFileSelector();

  const formik = useFormik<BookFormModel>({
    initialValues: {
      title: '',
      author: '',
      description: '',
      paid: false,
      price: null,
      coverUrl: null,
      epubUrl: null,
    },
    initialStatus: {
      apiErrors: {},
    },
    validationSchema: BookSchema,
    onSubmit: (values) => {
      if (!isEmpty(formik.status.apiErrors)) {
        return;
      }

      onSubmit(values);
    },
  });

  useEffect(() => {
    if (book) {
      formik.setValues({
        title: book.title,
        author: book.author,
        description: book.description,
        paid: book.paid,
        price: book.price,
        coverUrl: book.coverUrl,
        epubUrl: book.epubUrl,
      });
    } else {
      formik.resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book]);

  useEffect(() => {
    if (error) {
      handleValidationError<BookFormModel>(error, formik);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const titleError = getFormikError<BookFormModel>('title', {
    touched: formik.touched,
    errors: formik.errors,
    apiErrors: formik.status.apiErrors,
  });

  const authorError = getFormikError<BookFormModel>('author', {
    touched: formik.touched,
    errors: formik.errors,
    apiErrors: formik.status.apiErrors,
  });

  const descriptionError = getFormikError<BookFormModel>('description', {
    touched: formik.touched,
    errors: formik.errors,
    apiErrors: formik.status.apiErrors,
  });

  const priceError = getFormikError<BookFormModel>('price', {
    touched: formik.touched,
    errors: formik.errors,
    apiErrors: formik.status.apiErrors,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;

    if (has(formik.status.apiErrors, name)) {
      formik.setStatus({
        apiErrors: omit(formik.status.apiErrors, name),
      });
    }

    formik.handleChange(event);
  };

  const handlePaidChange = (_: React.ChangeEvent, checked: boolean) => {
    formik.setFieldValue('paid', checked);

    if (checked) {
      formik.registerField('price', {
        validate: (value: string) => (value === null ? ERRORS.REQUIRED_FIELD : undefined),
      });
    } else {
      formik.setFieldValue('price', null);
      formik.unregisterField('price');
    }
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === '') {
      formik.setFieldValue('price', null);
    } else {
      handleChange(event);
    }
  };

  const onCoverUpload = (publicUrl: string) => {
    formik.setFieldValue('coverUrl', publicUrl);
  };

  const onEpubUpload = (publicUrl: string) => {
    formik.setFieldValue('epubUrl', publicUrl);
  };

  return (
    <StyledAddBookForm>
      <div className="cover">
        <Card>
          <img
            src={formik.values.coverUrl || '/images/add-photo.svg'}
            alt="cover"
            data-testid="cover"
          />
        </Card>
        <Button
          variant="contained"
          color="primary"
          onClick={showImageSelector}
          data-testid="cover-selector"
        >
          Change Cover
        </Button>
        <ImageSelector
          open={isImageSelectorOpened}
          onImageUpload={onCoverUpload}
          onClose={hideImageSelector}
        />
      </div>
      <form id="bookForm" className="form" noValidate={true} onSubmit={formik.handleSubmit}>
        <TextField
          name="title"
          label="Title"
          variant="outlined"
          required={true}
          margin="normal"
          error={!!titleError}
          helperText={titleError}
          value={formik.values.title}
          onChange={handleChange}
        />
        <TextField
          name="author"
          label="Author"
          variant="outlined"
          required={true}
          margin="normal"
          error={!!authorError}
          helperText={authorError}
          value={formik.values.author}
          onChange={handleChange}
        />
        <TextField
          name="description"
          label="Description"
          variant="outlined"
          multiline={true}
          minRows={4}
          maxRows={12}
          required={true}
          margin="normal"
          error={!!descriptionError}
          helperText={descriptionError}
          value={formik.values.description}
          onChange={handleChange}
        />
        <div className="MuiFormControl-marginNormal epub">
          <Button
            variant="contained"
            color="primary"
            onClick={showFileSelector}
            data-testid="file-selector"
          >
            Change EPUB
          </Button>
          <FileSelector
            open={isFileSelectorOpened}
            onFileUpload={onEpubUpload}
            onClose={hideFileSelector}
          />
          {formik.values.epubUrl && (
            <a href={formik.values.epubUrl} target="_blank" data-testid="download" rel="noreferrer">
              Download
            </a>
          )}
        </div>
        <FormControlLabel
          control={
            <Checkbox checked={formik.values.paid} onChange={handlePaidChange} data-testid="paid" />
          }
          label="Paid"
        />
        {formik.values.paid && (
          <TextField
            type="number"
            className="price"
            name="price"
            label="Price"
            variant="outlined"
            required={true}
            margin="normal"
            error={!!priceError}
            helperText={priceError}
            value={formik.values.price || ''}
            onChange={handlePriceChange}
          />
        )}
        <CardActions>
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            disabled={loading}
            data-testid="save"
          >
            Save
          </Button>
        </CardActions>
      </form>
    </StyledAddBookForm>
  );
};

export default AddBookForm;

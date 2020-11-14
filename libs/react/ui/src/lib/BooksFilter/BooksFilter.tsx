import React, { useCallback, useState } from 'react';

import Icon from '@material-ui/core/Icon';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import { BooksFilter as IBooksFilter } from '@bookapp/shared/interfaces';

import { debounce } from 'lodash';

import { useBooksFilterStyles } from './useBooksFilterStyles';

export interface BooksFilterProps {
  filter: IBooksFilter;
  onSort: (sortValue: string) => void;
  onSearch: (searchValue: string) => void;
}

export const BooksFilter = ({
  filter: { searchQuery, sortValue },
  onSearch,
  onSort,
}: BooksFilterProps) => {
  const classes = useBooksFilterStyles();

  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [sort, setSort] = useState<string>(sortValue);

  const handleSortChange = (_: React.MouseEvent<HTMLElement>, sortBy: string | null) => {
    setSort(sortBy);
    onSort(sortBy);
  };

  // https://github.com/facebook/react/issues/1360#issuecomment-533847123
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedOnChange = useCallback(
    debounce((value: string) => onSearch(value), 500),
    []
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchTerm(value);
    debouncedOnChange(value);
  };

  return (
    <div className={classes.root}>
      <ToggleButtonGroup exclusive={true} value={sort} onChange={handleSortChange}>
        <ToggleButton value="rating_desc" data-testid="all">
          All books
        </ToggleButton>
        <ToggleButton value="createdAt_desc" data-testid="recent">
          Most recent
        </ToggleButton>
        <ToggleButton value="views_desc" data-testid="popular">
          Most popular
        </ToggleButton>
      </ToggleButtonGroup>
      <TextField
        label="Enter Book Title"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Icon>search</Icon>
            </InputAdornment>
          ),
        }}
        value={searchTerm}
        onChange={handleSearchChange}
        data-testid="search"
      />
    </div>
  );
};

export default BooksFilter;

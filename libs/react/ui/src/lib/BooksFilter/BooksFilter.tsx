import { MouseEvent, useCallback, useState } from 'react';

import Icon from '@mui/material/Icon';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { BooksFilter as IBooksFilter } from '@bookapp/shared/interfaces';

import { debounce } from 'lodash-es';

import { StyledBooksFilter } from './StyledBooksFilter';

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
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [sort, setSort] = useState<string>(sortValue);

  const handleSortChange = (_: MouseEvent<HTMLElement>, sortBy: string) => {
    if (sortBy !== null) {
      setSort(sortBy);
      onSort(sortBy);
    }
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
    <StyledBooksFilter>
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
        name="searchTerm"
        label="Enter Book Title"
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <Icon>search</Icon>
              </InputAdornment>
            ),
          },
        }}
        value={searchTerm}
        onChange={handleSearchChange}
        data-testid="search"
      />
    </StyledBooksFilter>
  );
};

export default BooksFilter;

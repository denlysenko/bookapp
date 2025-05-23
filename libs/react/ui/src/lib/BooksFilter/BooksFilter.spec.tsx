import { fireEvent, render, screen } from '@testing-library/react';

import { BooksFilter as IBooksFilter } from '@bookapp/shared/interfaces';

import BooksFilter from './BooksFilter';

jest.mock('lodash-es', () => ({
  debounce: jest.fn((fn) => fn),
}));

const onSort = jest.fn();
const onSearch = jest.fn();
const filter: IBooksFilter = {
  searchQuery: '',
  sortValue: 'createdAt_desc',
};

describe('BooksFilter', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render successfully', () => {
    const { baseElement } = render(
      <BooksFilter filter={filter} onSort={onSort} onSearch={onSearch} />
    );
    expect(baseElement).toBeTruthy();
  });

  it('should select default sort value', async () => {
    render(<BooksFilter filter={filter} onSort={onSort} onSearch={onSearch} />);
    expect(screen.getByTestId('recent')).toHaveClass('Mui-selected');
  });

  it('should select sort value and search query from props', async () => {
    const savedFilter: IBooksFilter = {
      searchQuery: 'test',
      sortValue: 'views_desc',
    };

    const { container } = render(
      <BooksFilter filter={savedFilter} onSort={onSort} onSearch={onSearch} />
    );

    expect(screen.getByTestId('popular')).toHaveClass('Mui-selected');
    expect(container.querySelector('[data-testid=search] input')).toHaveValue(
      savedFilter.searchQuery
    );
  });

  describe('handleSortChange', () => {
    it('should call onSort prop', async () => {
      render(<BooksFilter filter={filter} onSort={onSort} onSearch={onSearch} />);
      fireEvent.click(screen.getByTestId('popular'));
      expect(onSort).toHaveBeenCalledTimes(1);
      expect(onSort).toHaveBeenCalledWith('views_desc');
    });
  });

  describe('handleSearchChange', () => {
    it('should call onSearch prop', async () => {
      const searchTerm = 'test';
      const { container } = render(
        <BooksFilter filter={filter} onSort={onSort} onSearch={onSearch} />
      );
      fireEvent.change(container.querySelector('[data-testid=search] input'), {
        target: {
          value: searchTerm,
        },
      });
      expect(onSearch).toHaveBeenCalledTimes(1);
      expect(onSearch).toHaveBeenCalledWith(searchTerm);
    });
  });
});

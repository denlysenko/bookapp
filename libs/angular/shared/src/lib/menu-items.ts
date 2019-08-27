export interface MenuItem {
  label: string;
  path: string;
  icon: string;
  color?: string;
}

export const navs: MenuItem[] = [
  {
    label: 'Now Reading',
    path: 'books/read',
    icon: 'book'
  },
  {
    label: 'Browse Books',
    path: 'books/browse',
    icon: 'language'
  },
  {
    label: 'Buy Books',
    path: 'books/buy',
    icon: 'shopping_cart'
  },
  {
    label: 'Favourite',
    path: 'books/favourite',
    icon: 'star'
  },
  {
    label: 'Wishlist',
    path: 'books/wishlist',
    icon: 'list'
  },
  {
    label: 'History',
    path: 'history',
    icon: 'schedule'
  }
];

export const categories: MenuItem[] = [
  {
    label: 'Must Read Titles',
    path: 'books/mustread',
    icon: 'fiber_manual_record',
    color: '#e64c66'
  },
  {
    label: 'List of the Best',
    path: 'books/best',
    icon: 'fiber_manual_record',
    color: '#ffab00'
  }
];

export const userMenu: MenuItem[] = [
  {
    label: 'Edit Profile',
    path: 'profile',
    icon: 'account_circle'
  },
  {
    label: 'Change Password',
    path: 'password',
    icon: 'security'
  }
];

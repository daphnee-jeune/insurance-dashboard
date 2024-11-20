import {
  _id,
  _price,
  _times,
  _address,
  _boolean,
  _fullName,
  _taskNames,
  _postTitles,
  _description,
} from './_mock';

// ----------------------------------------------------------------------

export const _myAccount = {
  displayName: 'Jaydon Frankie',
  email: 'demo@minimals.cc',
  photoURL: '/assets/images/avatar/avatar-25.webp',
};

// ----------------------------------------------------------------------

export const _users = [...Array(24)].map((_, index) => ({
  id: _id(index),
  name: _fullName(index),
  address: _address(index),
  isVerified: _boolean(index),
  avatarUrl: `/assets/images/avatar/avatar-${index + 1}.webp`,
  statuses: ['Inquiry', 'Onboarding', 'Active', 'Churned'],
  status: index % 3 ? 'Active' : index % 5 ? 'Onboarding' : index % 5 ? 'Inquiry' : 'Churned',
  dob:
    [
      '06/09/1995',
      '01/01/2000',
      '09/18/1992',
      '01/13/1962',
      '05/04/1963',
      '08/30/1996',
      '03/06/1995',
      '01/29/1994',
      '10/18t/1990',
      '07/19/1994',
    ][index] || '01/01/1995',
}));

// ----------------------------------------------------------------------

export const _posts = [...Array(23)].map((_, index) => ({
  id: _id(index),
  title: _postTitles(index),
  description: _description(index),
  coverUrl: `/assets/images/cover/cover-${index + 1}.webp`,
  totalViews: 8829,
  totalComments: 7977,
  totalShares: 8556,
  totalFavorites: 8870,
  postedAt: _times(index),
  author: {
    name: _fullName(index),
    avatarUrl: `/assets/images/avatar/avatar-${index + 1}.webp`,
  },
}));


export const _langs = [
  {
    value: 'en',
    label: 'English',
    icon: '/assets/icons/flags/ic-flag-en.svg',
  },
  {
    value: 'de',
    label: 'German',
    icon: '/assets/icons/flags/ic-flag-de.svg',
  },
  {
    value: 'fr',
    label: 'French',
    icon: '/assets/icons/flags/ic-flag-fr.svg',
  },
];

// ----------------------------------------------------------------------

export const _timeline = [...Array(5)].map((_, index) => ({
  id: _id(index),
  title: [
    '1983, orders, $4220',
    '12 Invoices have been paid',
    'Order #37745 from September',
    'New order placed #XF-2356',
    'New order placed #XF-2346',
  ][index],
  type: `order${index + 1}`,
  time: _times(index),
}));

// ----------------------------------------------------------------------

export const _tasks = [...Array(5)].map((_, index) => ({
  id: _id(index),
  name: _taskNames(index),
}));


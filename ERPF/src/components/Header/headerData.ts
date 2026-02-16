const links = [
  {
    link: '/',
    label: 'Home',
  },
  {
    link: '/items',
    label: 'Item',
    links: [
      {
        link: '/items/item-fields',
        label: 'Item Fields',
      },
      {
        link: '/items/item-groups',
        label: 'Item Group',
      },
      {
        link: '/items/other',
        label: 'Other',
      },
    ],
  },
  {
    link: '/items-new',
    label: 'Item New',
  },
  {
    link: '/pricing',
    label: 'Pricing',
  },
  {
    link: '#2',
    label: 'Support',
    links: [
      {
        link: '/faq',
        label: 'FAQ',
      },
      {
        link: '/demo',
        label: 'Book a demo',
      },
      {
        link: '/forums',
        label: 'Forums',
      },
    ],
  },
]

export default links

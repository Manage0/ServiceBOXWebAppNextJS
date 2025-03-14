export const routes = {
  partners: {
    add: '/partners/add',
    edit: (id: string) => `/partners/edit/${id}`,
  },
  worksheets: {
    create: '/worksheets/create',
    edit: (id: string) => `/worksheets/edit/${id}`,
    details: (id: string) => `/worksheets/${id}`,
  },
  eCommerce: {
    createProduct: '/ecommerce/products/create',
    ediProduct: (slug: string) => `/ecommerce/products/${slug}/edit`,
    categories: '/ecommerce/categories',
    createOrder: '/ecommerce/orders/create',
    orderDetails: (id: string) => `/ecommerce/orders/${id}`,
    editOrder: (id: string) => `/ecommerce/orders/${id}/edit`,
    shop: '/ecommerce/shop',
    cart: '/ecommerce/cart',
    checkout: '/ecommerce/checkout',
  },
  support: {
    inbox: '/support/inbox',
    supportCategory: (category: string) => `/support/inbox/${category}`,
    messageDetails: (id: string) => `/support/inbox/${id}`,
    templates: '/support/templates',
    createTemplate: '/support/templates/create',
    viewTemplate: (id: string) => `/support/templates/${id}`,
    editTemplate: (id: string) => `/support/templates/${id}/edit`,
  },
  coworkers: {
    dashboard: '/coworkers',
  },
  logistics: {
    createShipment: '/logistics/shipments/create',
    editShipment: (id: string) => `/logistics/shipments/${id}/edit`,
    shipmentDetails: (id: string) => `/logistics/shipments/${id}`,
  },
  appointment: {
    dashboard: '/appointment',
    appointmentList: '/appointment/list',
  },
  file: {
    manager: '/file-manager',
    upload: '/file-manager/upload',
    create: '/file-manager/create',
  },
  rolesPermissions: '/roles-permissions',
  invoice: {
    home: '/invoice',
    create: '/invoice/create',
    details: (id: string) => `/invoice/${id}`,
    edit: (id: string) => `/invoice/${id}/edit`,
    builder: '/invoice/builder',
  },
  imageViewer: '/image-viewer',
  tables: {
    basic: '/tables/basic',
    collapsible: '/tables/collapsible',
    enhanced: '/tables/enhanced',
    pagination: '/tables/pagination',
    search: '/tables/search',
    stickyHeader: '/tables/sticky-header',
    resizable: '/tables/resizable',
    pinning: '/tables/pinning',
    dnd: '/tables/dnd',
  },
  multiStep: '/multi-step',
  forms: {
    profileSettings: '/forms/profile-settings',
    notificationPreference: '/forms/profile-settings/notification',
  },
  emailTemplates: '/email-templates',
  profile: '/profile',
  welcome: '/welcome',
  accessDenied: '/access-denied',
  notFound: '/not-found',
  auth: {
    signIn3: '/auth/sign-in-3',
  },
  signIn: '/signin',
};

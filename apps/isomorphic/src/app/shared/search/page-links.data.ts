import { routes } from '@/config/routes';
import { DUMMY_ID } from '@/config/constants';

// Note: do not add href in the label object, it is rendering as label
export const pageLinks = [
  /**TODO itt töltsd ki az oldalakkal */
  {
    name: 'E-Commerce',
     
  },
  {
    name: 'Logistics',
    href: routes.logistics.dashboard,
  },
  {
    name: 'Appointment',
    href: routes.appointment.dashboard,
  },
  {
    name: 'Create Product',
    href: routes.eCommerce.createProduct,
  },
  {
    name: 'Edit Product',
    href: routes.eCommerce.ediProduct(DUMMY_ID),
  },
  {
    name: 'Categories',
    href: routes.eCommerce.categories,
  },
  {
    name: 'Create Category',
    href: routes.eCommerce.createCategory,
  },
  {
    name: 'Edit Category',
    href: routes.eCommerce.editCategory(DUMMY_ID),
  },
  {
    name: 'Orders',
    href: routes.eCommerce.orders,
  },
  {
    name: 'Order Details',
    href: routes.eCommerce.orderDetails(DUMMY_ID),
  },
  {
    name: 'Create Order',
    href: routes.eCommerce.createOrder,
  },
  {
    name: 'Edit Order',
    href: routes.eCommerce.editOrder(DUMMY_ID),
  },
  {
    name: 'Reviews',
    href: routes.eCommerce.reviews,
  },
  {
    name: 'Shop',
    href: routes.eCommerce.shop,
  },
  {
    name: 'Cart',
    href: routes.eCommerce.cart,
  },
  {
    name: 'Checkout & Payment',
    href: routes.eCommerce.checkout,
  },
  {
    name: 'Support Inbox',
    href: routes.support.inbox,
  },
  {
    name: 'Support Snippets',
    href: routes.support.snippets,
  },
  {
    name: 'Support Templates',
    href: routes.support.templates,
  },
  {
    name: 'Invoice List',
    href: routes.invoice.home,
  },
  {
    name: 'Invoice Details',
    href: routes.invoice.details(DUMMY_ID),
  },
  {
    name: 'Create Invoice',
    href: routes.invoice.create,
  },
  {
    name: 'Edit Invoice',
    href: routes.invoice.edit(DUMMY_ID),
  },
  {
    name: 'Shipment List',
    href: routes.logistics.shipmentList,
  },
  {
    name: 'Shipment Details',
    href: routes.logistics.shipmentDetails(DUMMY_ID),
  },
  {
    name: 'File Manager',
    href: routes.file.manager,
  },
  {
    name: 'Profile Settings',
    href: routes.forms.profileSettings,
  },
  {
    name: 'Payment checkout',
    href: routes.eCommerce.checkout,
  },
  {
    name: 'Basic',
    href: routes.tables.basic,
  },
  {
    name: 'Collapsible',
    href: routes.tables.collapsible,
  },
  {
    name: 'Enhanced',
    href: routes.tables.enhanced,
  },
  {
    name: 'Sticky Header',
    href: routes.tables.stickyHeader,
  },
  {
    name: 'Pagination',
    href: routes.tables.pagination,
  },
  {
    name: 'Search',
    href: routes.tables.search,
  },
  {
    name: 'Profile',
    href: routes.profile,
  },
  {
    name: 'Welcome',
    href: routes.welcome,
  },
  {
    name: 'Coming soon',
    href: routes.comingSoon,
  },
  {
    name: 'Access Denied',
    href: routes.accessDenied,
  },
  {
    name: 'Not Found',
    href: routes.notFound,
  },
  {
    name: 'Maintenance',
    href: routes.maintenance,
  },
  {
    name: 'Blank',
    href: routes.blank,
  },
  {
    name: 'Trendy Sign Up',
    href: routes.auth.signUp3,
  },
  {
    name: 'Trendy Sign In',
    href: routes.auth.signIn3,
  },
  {
    name: 'Trendy Forgot Password',
    href: routes.auth.forgotPassword3,
  },
  {
    name: 'Trendy OTP Page',
    href: routes.auth.otp3,
  },
];

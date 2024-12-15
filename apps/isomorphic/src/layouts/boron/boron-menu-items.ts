import {
  PiShoppingCartDuotone,
  PiHeadsetDuotone,
  PiPackageDuotone,
  PiChartBarDuotone,
  PiCurrencyDollarDuotone,
  PiSquaresFourDuotone,
  PiGridFourDuotone,
  PiFeatherDuotone,
  PiChartLineUpDuotone,
  PiMapPinLineDuotone,
  PiUserGearDuotone,
  PiBellSimpleRingingDuotone,
  PiUserDuotone,
  PiEnvelopeSimpleOpenDuotone,
  PiStepsDuotone,
  PiCreditCardDuotone,
  PiTableDuotone,
  PiBrowserDuotone,
  PiHourglassSimpleDuotone,
  PiUserCircleDuotone,
  PiShootingStarDuotone,
  PiRocketLaunchDuotone,
  PiFolderLockDuotone,
  PiBinocularsDuotone,
  PiHammerDuotone,
  PiNoteBlankDuotone,
  PiUserPlusDuotone,
  PiShieldCheckDuotone,
  PiLockKeyDuotone,
  PiChatCenteredDotsDuotone,
  PiCalendarDuotone,
  PiCalendarPlusDuotone,
  PiEnvelopeDuotone,
  PiCurrencyCircleDollarDuotone,
  PiBriefcaseDuotone,
  PiHouseLineDuotone,
  PiAirplaneTiltDuotone,
  PiFolder,
  PiCaretCircleUpDownDuotone,
  PiListNumbersDuotone,
  PiCoinDuotone,
  PiShapesDuotone,
  PiNewspaperClippingDuotone,
  PiCodesandboxLogoDuotone,
  PiSparkleDuotone,
  PiArrowsOut,
  PiPushPinDuotone,
  PiArrowsOutLineHorizontalBold,
} from 'react-icons/pi';
import { routes } from '@/config/routes';
import { DUMMY_ID } from '@/config/constants';
import ProjectWriteIcon from '@core/components/icons/project-write';

// Note: do not add href in the label object, it is rendering as label
export const menuItems = [
  // label start
  {
    name: 'Overview',
  },
  // label end
  {
    name: 'Project',
    href: '/',
    icon: ProjectWriteIcon,
    shortcut: {
      modifiers: 'alt',
      key: '1',
    },
  },
  {
    name: 'Logistics',
    href: routes.logistics.dashboard,
    icon: PiPackageDuotone,
    shortcut: {
      modifiers: 'alt',
      key: '4',
    },
  },
  {
    name: 'E-Commerce',
    href: routes.eCommerce.dashboard,
    icon: PiShoppingCartDuotone,
    shortcut: {
      modifiers: 'alt',
      key: '5',
    },
  },
  {
    name: 'Support',
    href: routes.support.dashboard,
    icon: PiHeadsetDuotone,
    shortcut: {
      modifiers: 'alt',
      key: '7',
    },
  },
  {
    name: 'Appointment',
    href: routes.appointment.dashboard,
    icon: PiCalendarDuotone,
    shortcut: {
      modifiers: 'alt',
      key: '8',
    },
  },
  {
    name: 'Project',
    href: routes.project.dashboard,
    icon: ProjectWriteIcon,
    shortcut: {
      modifiers: 'alt',
      key: '0',
    },
  },
  // label start
  {
    name: 'Apps Kit',
  },
  // label end
  {
    name: 'E-Commerce',
    href: '#',
    icon: PiShoppingCartDuotone,
    dropdownItems: [
      {
        name: 'Products',
        href: routes.eCommerce.products,
      },
      {
        name: 'Product Details',
        href: routes.eCommerce.productDetails(DUMMY_ID),
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
    ],
  },
  {
    name: 'Support',
    href: '#',
    icon: PiHeadsetDuotone,
    dropdownItems: [
      {
        name: 'Inbox',
        href: routes.support.inbox,
      },
      {
        name: 'Snippets',
        href: routes.support.snippets,
      },
      {
        name: 'Templates',
        href: routes.support.templates,
      },
    ],
  },
  {
    name: 'Invoice',
    href: '#',
    icon: PiCurrencyDollarDuotone,
    dropdownItems: [
      {
        name: 'List',
        href: routes.invoice.home,
      },
      {
        name: 'Details',
        href: routes.invoice.details(DUMMY_ID),
      },
      {
        name: 'Create',
        href: routes.invoice.create,
      },
      {
        name: 'Edit',
        href: routes.invoice.edit(DUMMY_ID),
      },
    ],
  },
  {
    name: 'Logistics',
    href: '#',
    icon: PiPackageDuotone,
    dropdownItems: [
      {
        name: 'Shipment List',
        href: routes.logistics.shipmentList,
      },
      {
        name: 'Shipment Details',
        href: routes.logistics.shipmentDetails(DUMMY_ID),
      },
      {
        name: 'Create Shipment',
        href: routes.logistics.createShipment,
      },
      {
        name: 'Edit Shipment',
        href: routes.logistics.editShipment(DUMMY_ID),
      },
    ],
  },
  {
    name: 'Appointment',
    href: routes.appointment.appointmentList,
    icon: PiCalendarDuotone,
  },
  {
    name: 'File Manager',
    href: routes.file.manager,
    icon: PiFolder,
  },
  {
    name: 'Roles & Permissions',
    href: routes.rolesPermissions,
    icon: PiFolderLockDuotone,
  },
  {
    name: 'Invoice Builder',
    href: routes.invoice.builder,
    icon: PiNewspaperClippingDuotone,
  },
  {
    name: 'Image Viewer',
    href: routes.imageViewer,
    icon: PiCodesandboxLogoDuotone,
  },
  {
    name: 'Email Templates',
    href: routes.emailTemplates,
    icon: PiEnvelopeDuotone,
  },
  // label start
  {
    name: 'Forms',
  },
  // label end
  {
    name: 'Account Settings',
    href: routes.forms.profileSettings,
    icon: PiUserGearDuotone,
  },
  {
    name: 'Notification Preference',
    href: routes.forms.notificationPreference,
    icon: PiBellSimpleRingingDuotone,
  },
  {
    name: 'Multi Step',
    href: routes.multiStep,
    icon: PiStepsDuotone,
  },
  {
    name: 'Payment Checkout',
    href: routes.eCommerce.checkout,
    icon: PiCreditCardDuotone,
  },
  // label start
  {
    name: 'Tables',
  },
  // label end
  {
    name: 'Basic',
    href: routes.tables.basic,
    icon: PiGridFourDuotone,
  },
  {
    name: 'Collapsible',
    href: routes.tables.collapsible,
    icon: PiCaretCircleUpDownDuotone,
  },
  {
    name: 'Enhanced',
    href: routes.tables.enhanced,
    icon: PiTableDuotone,
  },
  {
    name: 'Sticky Header',
    href: routes.tables.stickyHeader,
    icon: PiBrowserDuotone,
  },
  {
    name: 'Pagination',
    href: routes.tables.pagination,
    icon: PiListNumbersDuotone,
  },
  {
    name: 'Search',
    href: routes.tables.search,
    icon: PiHourglassSimpleDuotone,
  },
  {
    name: 'Resizable',
    href: routes.tables.resizable,
    icon: PiArrowsOutLineHorizontalBold,
  },
  {
    name: 'Pinning',
    href: routes.tables.pinning,
    icon: PiPushPinDuotone,
  },
  {
    name: 'Drag & Drop',
    href: routes.tables.dnd,
    icon: PiArrowsOut,
  },

  // label start
  {
    name: 'Pages',
  },
  {
    name: 'Profile',
    href: routes.profile,
    icon: PiUserCircleDuotone,
  },
  {
    name: 'Welcome',
    href: routes.welcome,
    icon: PiShootingStarDuotone,
  },
  {
    name: 'Coming soon',
    href: routes.comingSoon,
    icon: PiRocketLaunchDuotone,
  },
  {
    name: 'Access Denied',
    href: routes.accessDenied,
    icon: PiFolderLockDuotone,
  },
  {
    name: 'Not Found',
    href: routes.notFound,
    icon: PiBinocularsDuotone,
  },
  {
    name: 'Maintenance',
    href: routes.maintenance,
    icon: PiHammerDuotone,
  },
  {
    name: 'Blank',
    href: routes.blank,
    icon: PiNoteBlankDuotone,
  },

  // label start
  {
    name: 'Authentication',
  },
  // label end
  {
    name: 'Sign Up',
    href: '#',
    icon: PiUserPlusDuotone,
    dropdownItems: [
      {
        name: 'Trendy Sign up',
        href: routes.auth.signUp3,
      },
    ],
  },
  {
    name: 'Sign In',
    href: '#',
    icon: PiShieldCheckDuotone,
    dropdownItems: [
      {
        name: 'Trendy Sign in',
        href: routes.auth.signIn3,
      },
    ],
  },
  {
    name: 'Forgot Password',
    href: '#',
    icon: PiLockKeyDuotone,
    dropdownItems: [
      {
        name: 'Trendy Forgot password',
        href: routes.auth.forgotPassword3,
      },
    ],
  },
  {
    name: 'OTP Pages',
    href: '#',
    icon: PiChatCenteredDotsDuotone,
    dropdownItems: [
      {
        name: 'Trendy OTP page',
        href: routes.auth.otp3,
      },
    ],
  },
];

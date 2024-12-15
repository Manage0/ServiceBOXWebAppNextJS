import { routes } from '@/config/routes';
import { DUMMY_ID } from '@/config/constants';
import {
  PiShoppingCart,
  PiHeadset,
  PiPackage,
  PiCurrencyDollar,
  PiGridFour,
  PiUserGear,
  PiSteps,
  PiCreditCard,
  PiTable,
  PiBrowser,
  PiHourglassSimple,
  PiUserCircle,
  PiShootingStar,
  PiRocketLaunch,
  PiFolderLock,
  PiBinoculars,
  PiHammer,
  PiNoteBlank,
  PiUserPlus,
  PiShieldCheck,
  PiLockKey,
  PiChatCenteredDots,
  PiFolder,
  PiListNumbers,
  PiCaretCircleUpDown,
  PiCalendarDuotone,
  PiNewspaperClippingDuotone,
  PiCodesandboxLogoDuotone,
  PiArrowsOutLineHorizontalBold,
  PiPushPinDuotone,
  PiArrowsOut,
} from 'react-icons/pi';
import ProjectWriteIcon from '@core/components/icons/project-write';
import Image from 'next/image';

// Note: do not add href in the label object, it is rendering as label
export const menuItems = [
  {
    name: 'Dashboard',
    href: '/',
    icon: (isActive: Boolean) => (
      <Image
        src={isActive ? '/DashboardIconBlack.svg' : '/DashboardIconWhite.svg'}
        alt="Dashboard icon"
        width={24}
        height={24}
      />
    ),
  },
  {
    name: 'Appointment',
    href: routes.appointment.dashboard,
    icon: <PiCalendarDuotone />,
  },
  {
    name: 'Project',
    href: routes.project.dashboard,
    icon: <ProjectWriteIcon />,
  },
  {
    name: 'Logistics',
    href: routes.logistics.dashboard,
    icon: <PiPackage />,
  },
  {
    name: 'E-Commerce',
    href: routes.eCommerce.dashboard,
    icon: <PiShoppingCart />,
  },
  {
    name: 'Support',
    href: routes.support.dashboard,
    icon: <PiHeadset />,
  },
  {
    name: 'E-Commerce',
    href: '#',
    icon: <PiShoppingCart />,
    dropdownItems: [
      {
        name: 'Products',
        href: routes.eCommerce.products,
        badge: '',
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
    icon: <PiHeadset />,
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
    icon: <PiCurrencyDollar />,
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
    icon: <PiPackage />,
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
    icon: <PiCalendarDuotone />,
  },
  {
    name: 'File Manager',
    href: routes.file.manager,
    icon: <PiFolder />,
  },
  {
    name: 'Roles & Permissions',
    href: routes.rolesPermissions,
    icon: <PiFolderLock />,
  },
  {
    name: 'Invoice Builder',
    href: routes.invoice.builder,
    icon: <PiNewspaperClippingDuotone />,
  },
  {
    name: 'Image Viewer',
    href: routes.imageViewer,
    icon: <PiCodesandboxLogoDuotone />,
    badge: 'NEW',
  },
  // label start
  {
    name: 'Forms',
  },
  // label end
  {
    name: 'Account Settings',
    href: routes.forms.profileSettings,
    icon: <PiUserGear />,
  },
  {
    name: 'Multi Step',
    href: routes.multiStep,
    icon: <PiSteps />,
  },
  {
    name: 'Payment Checkout',
    href: routes.eCommerce.checkout,
    icon: <PiCreditCard />,
  },
  // label start
  {
    name: 'Tables',
  },
  // label end
  {
    name: 'Basic',
    href: routes.tables.basic,
    icon: <PiGridFour />,
  },
  {
    name: 'Collapsible',
    href: routes.tables.collapsible,
    icon: <PiCaretCircleUpDown />,
  },
  {
    name: 'Enhanced',
    href: routes.tables.enhanced,
    icon: <PiTable />,
  },
  {
    name: 'Sticky Header',
    href: routes.tables.stickyHeader,
    icon: <PiBrowser />,
  },
  {
    name: 'Pagination',
    href: routes.tables.pagination,
    icon: <PiListNumbers />,
  },
  {
    name: 'Search',
    href: routes.tables.search,
    icon: <PiHourglassSimple />,
  },
  {
    name: 'Resizable',
    href: routes.tables.resizable,
    icon: <PiArrowsOutLineHorizontalBold />,
  },
  {
    name: 'Pinning',
    href: routes.tables.pinning,
    icon: <PiPushPinDuotone />,
  },
  {
    name: 'Drag & Drop',
    href: routes.tables.dnd,
    icon: <PiArrowsOut />,
  },
  // label start
  {
    name: 'Pages',
  },
  {
    name: 'Profile',
    href: routes.profile,
    icon: <PiUserCircle />,
  },
  {
    name: 'Welcome',
    href: routes.welcome,
    icon: <PiShootingStar />,
  },
  {
    name: 'Coming soon',
    href: routes.comingSoon,
    icon: <PiRocketLaunch />,
  },
  {
    name: 'Access Denied',
    href: routes.accessDenied,
    icon: <PiFolderLock />,
  },
  {
    name: 'Not Found',
    href: routes.notFound,
    icon: <PiBinoculars />,
  },
  {
    name: 'Maintenance',
    href: routes.maintenance,
    icon: <PiHammer />,
  },
  {
    name: 'Blank',
    href: routes.blank,
    icon: <PiNoteBlank />,
  },

  // label start
  {
    name: 'Authentication',
  },
  // label end
  {
    name: 'Sign Up',
    href: '#',
    icon: <PiUserPlus />,
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
    icon: <PiShieldCheck />,
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
    icon: <PiLockKey />,
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
    icon: <PiChatCenteredDots />,
    dropdownItems: [
      {
        name: 'Trendy OTP page',
        href: routes.auth.otp3,
      },
    ],
  },
];

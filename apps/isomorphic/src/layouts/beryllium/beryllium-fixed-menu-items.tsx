import { routes } from '@/config/routes';
import { DUMMY_ID } from '@/config/constants';
import { IconType } from 'react-icons/lib';
import {
  PiAirplaneTilt,
  PiBellSimpleRinging,
  PiBinoculars,
  PiBriefcase,
  PiCalendarDuotone,
  PiCalendarPlus,
  PiCards,
  PiChartBar,
  PiChartLineUp,
  PiChatCenteredDots,
  PiCreditCard,
  PiCurrencyCircleDollar,
  PiCurrencyDollar,
  PiEnvelopeSimpleOpen,
  PiFeather,
  PiFileImage,
  PiFolderLock,
  PiFolder,
  PiGridFour,
  PiHammer,
  PiHeadset,
  PiHouse,
  PiHouseLine,
  PiLightning,
  PiLockKey,
  PiMagicWand,
  PiMapPinLine,
  PiNoteBlank,
  PiNotePencil,
  PiPackage,
  PiPokerChip,
  PiRocketLaunch,
  PiShieldCheck,
  PiShieldCheckered,
  PiShootingStar,
  PiShoppingCart,
  PiSquaresFour,
  PiSteps,
  PiTable,
  PiUser,
  PiUserCircle,
  PiUserGear,
  PiUserPlus,
  PiShapes,
  PiNewspaperClippingDuotone,
  PiTableDuotone,
  PiCodesandboxLogoDuotone,
  PiSparkleDuotone,
} from 'react-icons/pi';
import { atom } from 'jotai';
import ProjectWriteIcon from '@core/components/icons/project-write';

export interface SubMenuItemType {
  name: string;
  description?: string;
  href: string;
  badge?: string;
}

export interface ItemType {
  name: string;
  icon: IconType;
  href?: string;
  description?: string;
  badge?: string;
  subMenuItems?: SubMenuItemType[];
}

export interface MenuItemsType {
  id: string;
  name: string;
  title: string;
  icon: IconType;
  menuItems: ItemType[];
}

export const berylliumMenuItems: MenuItemsType[] = [
  {
    id: '1',
    name: 'Home',
    title: 'Overview',
    icon: PiHouse,
    menuItems: [
      {
        name: 'Project Manager',
        href: '/',
        icon: ProjectWriteIcon,
      },
      {
        name: 'Appointment',
        href: routes.appointment.dashboard,
        icon: PiCalendarDuotone,
      },
      {
        name: 'Project',
        href: routes.project.dashboard,
        icon: ProjectWriteIcon,
      },
      {
        name: 'Logistics',
        href: routes.logistics.dashboard,
        icon: PiPackage,
      },
      {
        name: 'E-Commerce',
        href: routes.eCommerce.dashboard,
        icon: PiShoppingCart,
      },
      {
        name: 'Support',
        href: routes.support.dashboard,
        icon: PiHeadset,
      },
    ],
  },
  {
    id: '2',
    name: 'Apps',
    title: 'Apps Kit',
    icon: PiLightning,
    menuItems: [
      {
        name: 'E-Commerce',
        description: '"Shop Smart, Click Quick: Your One-Stop Solution!"',
        icon: PiShoppingCart,
        subMenuItems: [
          {
            name: 'Products',
            href: routes.eCommerce.products,
            badge: '',
          },
          {
            name: 'Product Details',
            href: routes.eCommerce.productDetails(DUMMY_ID),
            badge: '',
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
        description: '"Effortless Assistance at your Fingertips!"',
        icon: PiHeadset,
        subMenuItems: [
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
        description: 'Professional-looking invoices for each customer order',
        icon: PiCurrencyDollar,
        subMenuItems: [
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
        description:
          '"Streamline Shipments: Discover Efficiency with our Logistics!"',
        icon: PiPackage,
        subMenuItems: [
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
        name: 'File Manager',
        description:
          '"Organize, Access, and Share: Simplify your Digital World with us!"',
        icon: PiFileImage,
        subMenuItems: [
          {
            name: 'Manage Files',
            href: routes.file.manager,
          },
        ],
      },
      {
        name: 'Appointment',
        href: routes.appointment.appointmentList,
        icon: PiCalendarDuotone,
      },
      {
        name: 'Roles & Permissions',
        href: routes.rolesPermissions,
        icon: PiFolderLock,
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
        badge: 'New',
      },
    ],
  },
  {
    id: '5',
    name: 'Forms',
    title: 'Forms',
    icon: PiNotePencil,
    menuItems: [
      {
        name: 'Account Settings',
        href: routes.forms.profileSettings,
        icon: PiUserGear,
      },
      {
        name: 'Notification Preference',
        href: routes.forms.notificationPreference,
        icon: PiBellSimpleRinging,
      },
      {
        name: 'Multi Step',
        href: routes.multiStep,
        icon: PiSteps,
      },
      {
        name: 'Payment Checkout',
        href: routes.eCommerce.checkout,
        icon: PiCreditCard,
      },
    ],
  },
  {
    id: '6',
    name: 'Tables',
    title: 'Tables',
    icon: PiTable,
    menuItems: [
      {
        name: 'Tables',
        description: '"Shop Smart, Click Quick: Your One-Stop Solution!"',
        icon: PiGridFour,
        subMenuItems: [
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
            name: 'Resizable',
            href: routes.tables.resizable,
          },
          {
            name: 'Pinning',
            href: routes.tables.pinning,
          },
          {
            name: 'Drag & Drop',
            href: routes.tables.dnd,
          },
        ],
      },
    ],
  },
  {
    id: '7',
    name: 'Pages',
    title: 'Pages',
    icon: PiCards,
    menuItems: [
      {
        name: 'Profile',
        href: routes.profile,
        icon: PiMagicWand,
      },
      {
        name: 'Welcome',
        href: routes.welcome,
        icon: PiShootingStar,
      },
      {
        name: 'Coming Soon',
        href: routes.comingSoon,
        icon: PiRocketLaunch,
      },
      {
        name: 'Access Denied',
        href: routes.accessDenied,
        icon: PiFolderLock,
      },
      {
        name: 'Not Found',
        href: routes.notFound,
        icon: PiBinoculars,
      },
      {
        name: 'Maintenance',
        href: routes.maintenance,
        icon: PiHammer,
      },
      {
        name: 'Blank',
        href: routes.blank,
        icon: PiNoteBlank,
      },
    ],
  },
  {
    id: '8',
    name: 'Auth',
    title: 'Authentication',
    icon: PiShieldCheckered,
    menuItems: [
      {
        name: 'Sign Up',
        icon: PiUserPlus,
        description: '"Shop Smart, Click Quick: Your One-Stop Solution!"',
        subMenuItems: [
          {
            name: 'Trendy Sign Up',
            href: routes.auth.signUp3,
          },
        ],
      },
      {
        name: 'Sign In',
        icon: PiShieldCheck,
        description: '"Effortless Assistance at your Fingertips!"',
        subMenuItems: [
          {
            name: 'Trendy Sign In',
            href: routes.auth.signIn3,
          },
        ],
      },
      {
        name: 'Forgot Password',
        icon: PiLockKey,
        description:
          '"Streamline Shipments: Discover Efficiency with our Logistics!"',
        subMenuItems: [
          {
            name: 'Trendy Forgot Password',
            href: routes.auth.forgotPassword3,
          },
        ],
      },
      {
        name: 'OTP Pages',
        icon: PiChatCenteredDots,
        description:
          '"Organize, Access, and Share: Simplify your Digital World with us!"',
        subMenuItems: [
          {
            name: 'Trendy OTP Page',
            href: routes.auth.otp3,
          },
        ],
      },
    ],
  },
];
export const berylliumMenuItemAtom = atom(berylliumMenuItems[0]);

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
    name: 'Munkalapok',
    href: '/worksheets/list',
    icon: (isActive: Boolean) => (
      <Image
        src={isActive ? '/DocsBlack.svg' : '/DocsWhite.svg'}
        alt="Documents icon"
        width={24}
        height={24}
      />
    ),
  },
  {
    name: 'Munkatársak',
    href: routes.coworkers.dashboard,
    icon: (isActive: Boolean) => (
      <Image
        src={isActive ? '/UserBlack.svg' : '/UserWhite.svg'}
        alt="Users icon"
        width={24}
        height={24}
      />
    ),
  },
  {
    name: 'Termékek',
    href: '/products',
    icon: (isActive: Boolean) => (
      <Image
        src={isActive ? '/ProductsBlack.svg' : '/ProductsWhite.svg'}
        alt="Users icon"
        width={24}
        height={24}
      />
    ),
  },
  {
    name: 'Partnerek',
    href: '#',
    icon: (isActive: Boolean) => (
      <Image
        src={isActive ? '/ProviderBlack.svg' : '/ProviderWhite.svg'}
        alt="Users icon"
        width={24}
        height={24}
      />
    ),
  },
  {
    name: 'Beállítások',
    href: '#',
    icon: (isActive: Boolean) => (
      <Image
        src={isActive ? '/SettingsBlack.svg' : '/SettingsWhite.svg'}
        alt="Users icon"
        width={24}
        height={24}
      />
    ),
  },
];

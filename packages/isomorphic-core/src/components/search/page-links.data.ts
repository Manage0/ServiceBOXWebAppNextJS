import { routes } from "@core/config/routes";
import { DUMMY_ID } from "@core/config/constants";

// Note: do not add href in the label object, it is rendering as label
export const pageLinks = [
  // label start
  {
    name: "Home",
  },
  {
    name: "Appointment",
    href: routes.appointment.dashboard,
  },
  // label start
  {
    name: "Apps",
  },
  {
    name: "Create Product",
    href: routes.eCommerce.createProduct,
  },
  {
    name: "Edit Product",
    href: routes.eCommerce.ediProduct(DUMMY_ID),
  },
  {
    name: "Categories",
    href: routes.eCommerce.categories,
  },
  {
    name: "Create Category",
    href: routes.eCommerce.createCategory,
  },
  {
    name: "Edit Category",
    href: routes.eCommerce.editCategory(DUMMY_ID),
  },
  {
    name: "Orders",
    href: routes.eCommerce.orders,
  },
  {
    name: "Order Details",
    href: routes.eCommerce.orderDetails(DUMMY_ID),
  },
  {
    name: "Create Order",
    href: routes.eCommerce.createOrder,
  },
  {
    name: "Edit Order",
    href: routes.eCommerce.editOrder(DUMMY_ID),
  },
  {
    name: "Reviews",
    href: routes.eCommerce.reviews,
  },
  {
    name: "Shop",
    href: routes.eCommerce.shop,
  },
  {
    name: "Checkout & Payment",
    href: routes.eCommerce.checkout,
  },
  {
    name: "Support Inbox",
    href: routes.support.inbox,
  },
  {
    name: "Support Snippets",
    href: routes.support.snippets,
  },
  {
    name: "Support Templates",
    href: routes.support.templates,
  },
  {
    name: "Invoice List",
    href: routes.invoice.home,
  },
  {
    name: "Invoice Details",
    href: routes.invoice.details(DUMMY_ID),
  },
  {
    name: "Create Invoice",
    href: routes.invoice.create,
  },
  {
    name: "Edit Invoice",
    href: routes.invoice.edit(DUMMY_ID),
  },
  {
    name: "Shipment List",
    href: routes.logistics.shipmentList,
  },
  {
    name: "Shipment Details",
    href: routes.logistics.shipmentDetails(DUMMY_ID),
  },
  {
    name: "File Manager",
    href: routes.file.manager,
  },
  // label start
  {
    name: "Forms",
  },
  // label end
  {
    name: "Profile Settings",
    href: routes.forms.profileSettings,
  },
  {
    name: "Payment checkout",
    href: routes.eCommerce.checkout,
  },
  // label start
  {
    name: "Tables",
  },
  // label end
  {
    name: "Basic",
    href: routes.tables.basic,
  },
  {
    name: "Collapsible",
    href: routes.tables.collapsible,
  },
  {
    name: "Enhanced",
    href: routes.tables.enhanced,
  },
  {
    name: "Sticky Header",
    href: routes.tables.stickyHeader,
  },
  {
    name: "Pagination",
    href: routes.tables.pagination,
  },
  {
    name: "Search",
    href: routes.tables.search,
  },
  // label start
  {
    name: "Pages",
  },
  // label end
  {
    name: "Profile",
    href: routes.profile,
  },
  {
    name: "Welcome",
    href: routes.welcome,
  },
  {
    name: "Access Denied",
    href: routes.accessDenied,
  },
  {
    name: "Not Found",
    href: routes.notFound,
  },
  // label start
  {
    name: "Authentication",
  },
  // label end
  {
    name: "Trendy Sign In",
    href: routes.auth.signIn3,
  },
];

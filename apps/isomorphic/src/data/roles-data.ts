export type Permissions = {
  addNewWorkOrder?: boolean;
  edit?: boolean;
  delete?: boolean;
  printImage?: boolean;
  print?: boolean;
  changeStatus?: boolean;
  share?: boolean;
  sendForSignature?: boolean;
  recordSignature?: boolean;
  addNewEmployee?: boolean;
  editEmployee?: boolean;
  deleteEmployee?: boolean;
  viewEmployeeDetails?: boolean;
  printExportEmployee?: boolean;
  importEmployee?: boolean;
  addNewProduct?: boolean;
  editProduct?: boolean;
  deleteProduct?: boolean;
  viewProductDetails?: boolean;
  printExportProduct?: boolean;
  importProduct?: boolean;
  addNewPartner?: boolean;
  editPartner?: boolean;
  deletePartner?: boolean;
  viewPartnerDetails?: boolean;
  printExportPartnerList?: boolean;
  importPartner?: boolean;
  myData?: boolean;
  companyData?: boolean;
  roles?: boolean;
};

export type RolePermissions = {
  WorkOrders: Permissions;
  Employees: Permissions;
  Products: Permissions;
  Partners: Permissions;
  Settings: Permissions;
};

export type RoleDataType = {
  label: string;
  permissions: RolePermissions;
};

export const rolesData = [
  {
    label: 'Szervíz',
    permissions: {
      WorkOrders: {
        addNewWorkOrder: true,
        edit: true,
        delete: true,
        printImage: false,
        download: false,
        changeStatus: true,
        share: false,
        sendForSignature: false,
        recordSignature: true,
      },
      Employees: {
        addNewEmployee: false,
        editEmployee: false,
        deleteEmployee: false,
        viewEmployeeDetails: false,
        printExportEmployee: false,
        importEmployee: false,
      },
      Products: {
        addNewProduct: false,
        editProduct: false,
        deleteProduct: false,
        viewProductDetails: false,
        printExportProduct: false,
        importProduct: false,
      },
      Partners: {
        addNewPartner: true,
        editPartner: true,
        deletePartner: true,
        viewPartnerDetails: true,
        printExportPartnerList: true,
        importPartner: true,
      },
      Settings: {
        myData: false,
        companyData: false,
        roles: false,
      },
    },
  },
  {
    label: 'Szervíz expert',
    permissions: {
      WorkOrders: {
        addNewWorkOrder: true,
        edit: false,
        delete: true,
        printImage: false,
        download: true,
        changeStatus: false,
        share: true,
        sendForSignature: false,
        recordSignature: true,
      },
      Employees: {
        addNewEmployee: false,
        editEmployee: true,
        deleteEmployee: true,
        viewEmployeeDetails: false,
        printExportEmployee: false,
        importEmployee: true,
      },
      Products: {
        addNewProduct: true,
        editProduct: false,
        deleteProduct: false,
        viewProductDetails: true,
        printExportProduct: false,
        importProduct: true,
      },
      Partners: {
        addNewPartner: true,
        editPartner: true,
        deletePartner: false,
        viewPartnerDetails: true,
        printExportPartnerList: false,
        importPartner: true,
      },
      Settings: {
        myData: false,
        companyData: false,
        roles: true,
      },
    },
  },
  {
    label: 'Szervíz vezető',
    permissions: {
      WorkOrders: {
        addNewWorkOrder: false,
        edit: true,
        delete: false,
        printImage: true,
        download: false,
        changeStatus: true,
        share: false,
        sendForSignature: true,
        recordSignature: false,
      },
      Employees: {
        addNewEmployee: true,
        editEmployee: false,
        deleteEmployee: false,
        viewEmployeeDetails: true,
        printExportEmployee: true,
        importEmployee: false,
      },
      Products: {
        addNewProduct: false,
        editProduct: true,
        deleteProduct: false,
        viewProductDetails: false,
        printExportProduct: true,
        importProduct: true,
      },
      Partners: {
        addNewPartner: false,
        editPartner: true,
        deletePartner: true,
        viewPartnerDetails: true,
        printExportPartnerList: true,
        importPartner: false,
      },
      Settings: {
        myData: true,
        companyData: true,
        roles: false,
      },
    },
  },
  {
    label: 'Gyakornok',
    permissions: {
      WorkOrders: {
        addNewWorkOrder: true,
        edit: true,
        delete: true,
        printImage: false,
        download: false,
        changeStatus: true,
        share: false,
        sendForSignature: false,
        recordSignature: true,
      },
      Employees: {
        addNewEmployee: false,
        editEmployee: false,
        deleteEmployee: false,
        viewEmployeeDetails: false,
        printExportEmployee: false,
        importEmployee: false,
      },
      Products: {
        addNewProduct: false,
        editProduct: false,
        deleteProduct: false,
        viewProductDetails: false,
        printExportProduct: false,
        importProduct: false,
      },
      Partners: {
        addNewPartner: true,
        editPartner: true,
        deletePartner: true,
        viewPartnerDetails: true,
        printExportPartnerList: true,
        importPartner: true,
      },
      Settings: {
        myData: false,
        companyData: false,
        roles: false,
      },
    },
  },
  {
    label: 'Vezető',
    permissions: {
      WorkOrders: {
        addNewWorkOrder: false,
        edit: true,
        delete: false,
        printImage: true,
        download: false,
        changeStatus: true,
        share: false,
        sendForSignature: true,
        recordSignature: false,
      },
      Employees: {
        addNewEmployee: true,
        editEmployee: false,
        deleteEmployee: false,
        viewEmployeeDetails: true,
        printExportEmployee: true,
        importEmployee: false,
      },
      Products: {
        addNewProduct: false,
        editProduct: true,
        deleteProduct: false,
        viewProductDetails: false,
        printExportProduct: true,
        importProduct: true,
      },
      Partners: {
        addNewPartner: false,
        editPartner: true,
        deletePartner: true,
        viewPartnerDetails: true,
        printExportPartnerList: true,
        importPartner: false,
      },
      Settings: {
        myData: true,
        companyData: true,
        roles: false,
      },
    },
  },
];

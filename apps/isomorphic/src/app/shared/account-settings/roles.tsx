'use client';

import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';
import { SubmitHandler, Controller } from 'react-hook-form';
import {
  PiClock,
  PiEnvelopeSimple,
  PiCaretLeftBold,
  PiCaretRightBold,
} from 'react-icons/pi';
import { Form } from '@core/ui/form';
import { Loader, Text, Input, Button, Checkbox } from 'rizzui';
import FormGroup from '@/app/shared/form-group';
import FormFooter from '@core/components/form-footer';
import {
  defaultValues,
  personalInfoFormSchema,
  PersonalInfoFormTypes,
} from '@/validators/personal-info.schema';
import UploadZone from '@core/ui/file-upload/upload-zone';
import { countries, roles, timezones } from '@/data/forms/my-details';
import AvatarUpload from '@core/ui/file-upload/avatar-upload';
import Link from 'next/link';
import cn from '@core/utils/class-names';
import { useScrollableSlider } from '@core/hooks/use-scrollable-slider';
import { usePathname } from 'next/navigation';
import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';
import { rolesData } from '@/data/roles-data'; // Import rolesData
import { useState } from 'react';

const Select = dynamic(() => import('rizzui').then((mod) => mod.Select), {
  ssr: false,
  loading: () => (
    <div className="grid h-10 place-content-center">
      <Loader variant="spinner" />
    </div>
  ),
});

const QuillEditor = dynamic(() => import('@core/ui/quill-editor'), {
  ssr: false,
});

export const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="text-left font-inter text-sm font-normal tracking-normal text-[#25282B] opacity-100">
    {children}
  </div>
);

export const LabeledInput = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col gap-4">{children}</div>
);

export default function RolesView() {
  const onSubmit: SubmitHandler<PersonalInfoFormTypes> = (data) => {
    toast.success(<Text as="b">Successfully added!</Text>);
    console.log('Profile settings data ->', {
      ...data,
    });
  };

  const {
    sliderEl,
    sliderPrevBtn,
    sliderNextBtn,
    scrollToTheRight,
    scrollToTheLeft,
  } = useScrollableSlider();

  const pathname = usePathname();

  const menuItems = rolesData.map((role) => ({
    label: role.label,
    value: role.permissions,
  }));

  const [selectedRole, setSelectedRole] = useState(menuItems[0]);

  type Permissions = {
    [key: string]: {
      [key: string]: boolean;
    };
  };

  const [selectedRolePermissions, setSelectedRolePermissions] =
    useState<Permissions>(rolesData[0].permissions);

  const handleCheckboxChange = (category: string, permissionKey: string) => {
    setSelectedRolePermissions((prevPermissions) => ({
      ...prevPermissions,
      [category]: {
        ...prevPermissions[category],
        [permissionKey]: !prevPermissions[category][permissionKey],
      },
    }));
  };

  const permissionLabels: { [key: string]: string } = {
    addNewWorkOrder: 'Új munkalap rögzítése',
    edit: 'Módosítás',
    delete: 'Törlés',
    printImage: 'Nyomtatási kép',
    download: 'Letöltés',
    changeStatus: 'Státusz módosítás',
    share: 'Megosztás',
    sendForSignature: 'Aláírásra küldés',
    recordSignature: 'Aláírás rögzítése',
    addNewEmployee: 'Új termék rögzítése',
    editEmployee: 'Termék módosítása',
    deleteEmployee: 'Termék törlése',
    viewEmployeeDetails: 'Termék adatlap megtekintése',
    printExportEmployee: 'Termék nyomtatás, export',
    importEmployee: 'Termék import',
    addNewProduct: 'Új termék rögzítése',
    editProduct: 'Termék módosítása',
    deleteProduct: 'Termék törlése',
    viewProductDetails: 'Termék adatlap megtekintése',
    printExportProduct: 'Termék nyomtatás, export',
    importProduct: 'Termék import',
    addNewPartner: 'Új partner rögzítése',
    editPartner: 'Partner módosítása',
    deletePartner: 'Partner törlése',
    viewPartnerDetails: 'Partner adatlap megtekintése',
    printExportPartnerList: 'Lista nyomtatás, export',
    importPartner: 'Partner import',
    myData: 'Adataim',
    password: 'Jelszó',
    companyData: 'Cégadatok',
    roles: 'Szerepkörök',
  };
  const categoryLabels: { [key: string]: string } = {
    WorkOrders: 'Munkalapok',
    Employees: 'Munkatársak',
    Products: 'Termékek',
    Partners: 'Partnerek',
    Settings: 'Beállítások',
  };

  // Calculate checkboxValue for each category
  const getCheckboxValue = (permissions: { [key: string]: boolean }) => {
    const values = Object.values(permissions);
    const allChecked = values.every((value) => value === true);
    const noneChecked = values.every((value) => value === false);

    if (allChecked) return 'checked';
    if (noneChecked) return 'unchecked';
    return 'indeterminate';
  };

  return (
    <Form<PersonalInfoFormTypes>
      validationSchema={personalInfoFormSchema}
      // resetValues={reset}
      onSubmit={onSubmit}
      className="@container"
      useFormProps={{
        mode: 'onChange',
        defaultValues,
      }}
    >
      {({ register, control, setValue, getValues, formState: { errors } }) => {
        return (
          <>
            <div
              className={cn(
                'sticky z-20 -mx-4 -mt-4 border-b border-muted bg-white px-4 py-0 font-medium text-gray-500 dark:bg-gray-50 sm:-mt-2 md:-mx-5 md:px-5 lg:-mx-8 lg:mt-0 lg:px-8 xl:-mx-6 xl:px-6 2xl:top-20 3xl:-mx-[33px] 3xl:px-[33px] 4xl:-mx-10 4xl:px-10'
              )}
            >
              <div className="relative flex items-center overflow-hidden">
                <Button
                  title="Prev"
                  variant="text"
                  ref={sliderPrevBtn}
                  onClick={() => scrollToTheLeft()}
                  className="!absolute left-0 top-0.5 z-10 !h-[calc(100%-4px)] w-8 !justify-start bg-gradient-to-r from-white via-white to-transparent px-0 text-gray-500 hover:text-black dark:from-gray-50 dark:via-gray-50 lg:hidden"
                >
                  <PiCaretLeftBold className="w-5" />
                </Button>
                <div className="flex h-[52px] items-start overflow-hidden">
                  <div
                    className="-mb-7 flex w-full gap-3 overflow-x-auto scroll-smooth pb-7 md:gap-5 lg:gap-8"
                    ref={sliderEl}
                  >
                    {menuItems.map((menu, index) => (
                      <Link
                        href={'#'}
                        onClick={() => {
                          setSelectedRole(menu);
                          setSelectedRolePermissions(menu.value);
                        }}
                        key={`menu-${index}`}
                        className={cn(
                          'group relative cursor-pointer whitespace-nowrap py-2.5 font-medium text-gray-500 before:absolute before:bottom-0 before:left-0 before:z-[1] before:h-0.5 before:bg-gray-1000 before:transition-all hover:text-gray-900',
                          menu.label === selectedRole.label
                            ? 'before:visible before:w-full before:opacity-100'
                            : 'before:invisible before:w-0 before:opacity-0'
                        )}
                      >
                        <Text
                          as="span"
                          className="inline-flex rounded-md px-2.5 py-1.5 transition-all duration-200 group-hover:bg-gray-100/70"
                        >
                          {menu.label}
                        </Text>
                      </Link>
                    ))}
                  </div>
                </div>
                <Button
                  title="Next"
                  variant="text"
                  ref={sliderNextBtn}
                  onClick={() => scrollToTheRight()}
                  className="!absolute right-0 top-0.5 z-10 !h-[calc(100%-4px)] w-8 !justify-end bg-gradient-to-l from-white via-white to-transparent px-0 text-gray-500 hover:text-black dark:from-gray-50 dark:via-gray-50 lg:hidden"
                >
                  <PiCaretRightBold className="w-5" />
                </Button>
              </div>
            </div>
            <div className="mb-10 grid gap-7 divide-y divide-dashed divide-gray-200 @2xl:gap-9 @3xl:gap-11">
              {Object.entries(selectedRolePermissions).map(
                ([category, permissions]) => (
                  <FormGroup
                    key={category}
                    title={categoryLabels[category] || category}
                    checkboxValue={getCheckboxValue(permissions)}
                    className="custom-checkbox-grid pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
                  >
                    {Object.entries(permissions).map(
                      ([permission, isEnabled]) => (
                        <label
                          key={permission}
                          className="flex items-center gap-2"
                        >
                          <Checkbox
                            type="checkbox"
                            checked={isEnabled}
                            onChange={() =>
                              handleCheckboxChange(category, permission)
                            }
                          />
                          <span className="text-sm">
                            {permissionLabels[permission] || permission}
                          </span>
                        </label>
                      )
                    )}
                  </FormGroup>
                )
              )}
            </div>
            <FormFooter
              // isLoading={isLoading}
              altBtnText="Mégsem"
              submitBtnText="Mentés"
            />
          </>
        );
      }}
    </Form>
  );
}

import PageHeader from '@/app/shared/page-header';
import RolesGrid from '@/app/shared/roles-permissions/roles-grid';
import UsersTable from '@/app/shared/roles-permissions/users-table';
import CreateRole from '@/app/shared/roles-permissions/create-role';
import AddBtn from '@/app/shared/add-btn';

const pageHeader = {
  title: 'Roles and Permissions ',
  breadcrumb: [
    {
      href: '/',
      name: 'Dashboard',
    },
    {
      name: 'Role Management & Permission',
    },
  ],
};

export default function BlankPage() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <AddBtn text="Add New Role" modalView={<CreateRole />} />
      </PageHeader>
      <RolesGrid />
      <UsersTable />
    </>
  );
}

import dynamic from 'next/dynamic';
import PageHeader from '@/app/shared/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import UploadButton from '@/app/shared/upload-button';
const FileUpload = dynamic(() => import('@/app/shared/file-upload'), {
  ssr: false,
});

export const metadata = {
  ...metaObject('File Manager'),
};

const pageHeader = {
  title: 'File Manager',
  breadcrumb: [
    {
      href: routes.eCommerce.dashboard,
      name: 'Home',
    },
    {
      name: 'List',
    },
  ],
};

export default function FileListPage() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <UploadButton modalView={<FileUpload />} />
        {/**TODO use this for file upload */}
      </PageHeader>
    </>
  );
}

import { metaObject } from '@/config/site.config';
import CreateEditShipment from '@/app/shared/coworkers/shipment/create-edit';

export const metadata = {
  ...metaObject('Create Shipment'),
};

export default function CreateShipmentPage() {
  return <CreateEditShipment />;
}

export type PartnerType = {
  id: string;
  name: string;
  tax_num: string;
  contact_person: string;
  external_id: string;
  email: string;
  contact_phone_number: string;
  country: string;
  postal_code: string;
  city: string;
  address: string;
};

//TODO Ha a stock reportnak vége, akkor ez is mehet
export const partnersData = [
  {
    id: '0o02051402',
    name: 'BBOX Computer s.r.o.',
    tax_num: '677872747',
    contact_person: 'Hódosi Norbert',
    external_id: 'EXTID-12354',
    email: 'asd@asd.asd',
    contact_phone_number: '+36837285993',
    country: 'Magyarország',
    postal_code: '1111',
    city: 'Budapest',
    address: 'Kossuth Lajos utca 1',
  },
];

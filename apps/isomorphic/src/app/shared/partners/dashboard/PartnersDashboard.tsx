import PartnersTable from '../../invoice/invoice-list/PartnersTable';

export default function PartnersDashboard() {
  return (
    <div className="@container">
      <PartnersTable searchbarPlaceholder="Keresés..." />
    </div>
  );
}

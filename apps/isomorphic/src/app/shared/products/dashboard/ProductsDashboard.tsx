import ProductsTable from '../../invoice/invoice-list/ProductsTable';

export default function ProductsDashboard() {
  return (
    <div className="@container">
      <ProductsTable searchbarPlaceholder="Keresés..." />
    </div>
  );
}

'use client';

import Table from '@core/components/table';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import Filters from './filters';
import TablePagination from '@core/components/table/pagination';
import TableFooter from '@core/components/table/footer';
import { productsColumns } from './ProductsColumns';
import { productsData } from '@/data/prod-data';
import { useEffect, useState } from 'react';

export type ProductsTableDataType = (typeof productsData)[number];
export type SearchableTableProps = {
  searchbarPlaceholder: string;
};

export default function ProductsTable({
  searchbarPlaceholder,
}: SearchableTableProps) {
  const [products, setProducts] = useState<ProductsTableDataType[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<
    ProductsTableDataType[]
  >([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { table, setData } = useTanStackTable<ProductsTableDataType>({
    tableData: filteredProducts,
    columnConfig: productsColumns,
    options: {
      initialState: {
        pagination: {
          pageIndex: 0,
          pageSize: 10,
        },
      },
      enableColumnResizing: false,
    },
  });

  useEffect(() => {
    setData(filteredProducts);
  }, [filteredProducts, setData]);

  useEffect(() => {
    async function getProducts() {
      try {
        const res = await fetch('/api/products', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (res.ok) {
          const data: ProductsTableDataType[] =
            (await res.json()) as ProductsTableDataType[];
          setProducts(data);
          setFilteredProducts(data);

          // Extract unique categories
          const uniqueCategories = Array.from(
            new Set(data.map((product) => product.category))
          );
          setCategories(uniqueCategories);
        } else {
          console.error('Failed to fetch products:', await res.json());
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }
    getProducts();
  }, [setData]);

  useEffect(() => {
    if (selectedCategory && selectedCategory !== 'all') {
      setFilteredProducts(
        products.filter((product) => product.category === selectedCategory)
      );
    } else {
      setFilteredProducts(products);
    }
  }, [selectedCategory, products]);

  return (
    <>
      <Filters
        table={table}
        searchbarPlaceholder={searchbarPlaceholder}
        dropdownProps={{
          options: [
            { label: 'Minden kategória', value: 'all' },
            ...categories.map((category) => ({
              label: category,
              value: category,
            })),
          ],
          onChange: (value) => {
            setSelectedCategory(value);
          },
        }}
      />
      <Table
        table={table}
        variant="modern"
        classNames={{
          container: 'border border-muted rounded-md',
          rowClassName: 'last:border-0',
        }}
      />
      <TableFooter table={table} />
      <TablePagination table={table} className="py-4" />
    </>
  );
}

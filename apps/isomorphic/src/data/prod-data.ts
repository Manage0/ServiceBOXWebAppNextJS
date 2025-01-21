export type ProductType = {
  id: string;
  name: string;
  category: string;
  image: string;
  sku: string;
  stock: number;
  price: string;
  status: string;
  measure: string;
};

export const productsData = [
  {
    id: '0o02051402',
    name: 'Tasty Metal Shirt',
    category: 'Books',
    image:
      'https://isomorphic-furyroad.s3.amazonaws.com/public/products/modern/7.webp',
    sku: '52442',
    stock: 30,
    price: '410.00',
    status: 'Vázlat',
    measure: 'db',
  },
];

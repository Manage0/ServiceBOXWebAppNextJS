import React from 'react';

interface DateItem {
  label: string;
  value: string;
}

interface InvoiceDatesProps {
  dates: DateItem[];
}

const InvoiceDates: React.FC<InvoiceDatesProps> = ({ dates }) => {
  return (
    <div className="mb-8 grid grid-cols-2 rounded-md border border-gray-200 bg-gray-100 text-sm text-gray-800 sm:grid-cols-4">
      {dates.map(({ label, value }, index) => (
        <div
          key={index}
          className="flex flex-col items-center border-r border-gray-300 py-2 last:border-r-0"
        >
          <span className="font-medium">{label}</span>
          <span>{value}</span>
        </div>
      ))}
    </div>
  );
};

export default InvoiceDates;

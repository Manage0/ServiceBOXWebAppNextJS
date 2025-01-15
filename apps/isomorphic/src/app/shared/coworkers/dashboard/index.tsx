'use client';
import { useState } from 'react';
import CoworkersTable from './coworkers-table/coworkersTable';
import CoworkersPageHeader from '@/app/(hydrogen)/coworkers/page-header';

export default function CoworkersDashboard() {
  const [isLoading, setLoading] = useState(false);
  return (
    <>
      <CoworkersPageHeader isLoading={isLoading} setLoading={setLoading} />
      <div className="flex flex-col gap-10">
        <div className="@container">
          <CoworkersTable
            searchbarPlaceholder="Keresés..."
            isLoading={isLoading}
            setLoading={setLoading}
          />
        </div>
      </div>
    </>
  );
}

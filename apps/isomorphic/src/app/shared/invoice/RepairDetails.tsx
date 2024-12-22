import React from 'react';

interface DataItem {
  label: string;
  value: string;
}

interface RepairDetailsProps {
  title: string;
  details: DataItem[];
}

const RepairDetails: React.FC<RepairDetailsProps> = ({ title, details }) => {
  return (
    <div className="mb-6">
      <h2 className="mb-8 ml-16 text-left font-lexend text-[30px] font-bold leading-[32px] tracking-[0px] text-[#333333]">
        {title}
      </h2>
      <div className="grid grid-cols-[30%_70%] gap-y-4 text-sm">
        {details.map(({ label, value }, index) => (
          <React.Fragment key={index}>
            <span className="font-medium">{label}</span>
            <b>{value}</b>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default RepairDetails;

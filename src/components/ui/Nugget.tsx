import React from "react";

interface NuggetProps {
  tagItem: string;
}

const Nugget: React.FC<NuggetProps> = ({ tagItem }) => {
  return (
    <div className="bg-primary-xBackgroundCard border border-primary-xBackground text-primary-300 px-3 py-0.5 text-sm rounded-xl">
      {tagItem.substring(1)}
    </div>
  );
};

export default Nugget;

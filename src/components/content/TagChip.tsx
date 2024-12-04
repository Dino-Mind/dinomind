import { FC } from "react";

type TagChipProps = {
  tag: string;
  isSelected?: boolean;
};

export const TagChip: FC<TagChipProps> = ({ tag, isSelected }) => {
  return (
    <div
      className={`text-sm px-2 py-1 rounded-md cursor-pointer ${
        isSelected
          ? "bg-primary-xPrimary text-white"
          : "border border-primary-xPrimary bg-primary-xBackgroundCard text-white"
      }`}
    >
      {tag}
    </div>
  );
};

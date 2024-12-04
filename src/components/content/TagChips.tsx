import { FC, useEffect, useState } from "react";
import { TagChip } from "./TagChip";
import { loadTagStatData } from "@/utils/dataUtils";
import { getMostLikedTags } from "@/utils/getMostLikedTags";

type TagChipProps = {
  onTagSelect: (tags: string[]) => void;
};
export const TagChips: FC<TagChipProps> = ({ onTagSelect }) => {
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    loadTagStatData((tagData) => {
      const interestData = getMostLikedTags(tagData);
      setTags(interestData);
    });
  }, []);

  const handleTagSelect = (tag: string) => {
    const index = selectedTags.indexOf(tag);
    if (index === -1) {
      setSelectedTags([...selectedTags, tag]);
      onTagSelect([...selectedTags, tag]);
    } else {
      const newTags = selectedTags.filter((t) => t !== tag);
      setSelectedTags(newTags);
      onTagSelect(newTags);
    }
  };

  return (
    <div className="flex flex-wrap">
      {tags.map((tag, index) => (
        <div key={index} className="m-1" onClick={() => handleTagSelect(tag)}>
          <TagChip tag={tag} isSelected={selectedTags.includes(tag)} />
        </div>
      ))}
    </div>
  );
};

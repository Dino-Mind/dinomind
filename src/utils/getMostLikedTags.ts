import { TagStat } from "./dataUtils";

export const getMostLikedTags = (tagData: TagStat[]) => {
    const sortedTagData = tagData.sort((a, b) => b.ctr - a.ctr);
    const topTags = sortedTagData.slice(0, 4);
    const randomTag = sortedTagData[Math.floor(Math.random() * sortedTagData.length)];
    const interestData = [...topTags.map(tag => tag.tag), randomTag.tag];
    return interestData;
}
import { loadContentData, saveContentData } from "./dataUtils";
import { summarizeText } from "./fetchGeminiSummarize";

export const createSummaryForContent = async (id: string, content: string) => {
  console.log("Creating summary for content with id: ", id);
  const contentDataSummary = await summarizeText(content);
  loadContentData((contentData) => {
    const updatedContentData = contentData.map((contentItem) => {
      if (contentItem.id === id) {
        return {
          ...contentItem,
          summary: contentDataSummary,
        };
      }
      return contentItem;
    });
    saveContentData(updatedContentData);
  });

  console.log("Summary created: ", contentDataSummary);
  return contentDataSummary;
};

import { loadContentData, saveContentData } from "./dataUtils";
import { summarizeText } from "./fetchGeminiSummarize";

export const createSummaryForContent = async (id: string, content: string) => {
  const summ = await summarizeText(content);
  loadContentData((contentData) => {
    const updatedContentData = contentData.map((contentItem) => {
      if (contentItem.id === id) {
        return {
          ...contentItem,
          summary: summ,
        };
      }
      return contentItem;
    });
    saveContentData(updatedContentData);
  })
}
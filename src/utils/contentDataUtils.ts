import { loadInterestData, loadContentData } from "./chatDataUtils";

export const loadContentAndInterestData = async (
  setContentTags: React.Dispatch<React.SetStateAction<string | null>>,
  setContentResponse: React.Dispatch<React.SetStateAction<string | null>>,
  setLoading: (loading: boolean) => void
): Promise<void> => {
  setLoading(true);

  try {
    const [savedTags, savedContent] = await Promise.all([
      new Promise<string | null>((resolve) => {
        loadInterestData((data) => resolve(data || null));
      }),
      new Promise<string | null>((resolve) => {
        loadContentData((data) => resolve(data || null));
      }),
    ]);

    setContentTags(savedTags);
    setContentResponse(savedContent);
  } catch (error) {
    console.error("Error loading content and interest data:", error);
  } finally {
    setLoading(false);
  }
};

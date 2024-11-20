import { useEffect, useState } from "react";
import { loadInterestData, saveContentData } from "../utils/dataUtils";
import { useGeminiNanoResponse } from "../utils/fetchGeminiResponse";

export const useGenerateContent = () => {
  const [interestData, setInterestData] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<string[]>([]);

  const { fetchGeminiNanoResponse, loading } = useGeminiNanoResponse();

    useEffect(() => {
    loadInterestData(setInterestData);
    }, []);

    const fetchGenerateContent = async () => {
        if (!interestData) {
            return 
        }

        const responses = await Promise.all(
            interestData
            .split(", ")
            .map((tag) => fetchGeminiNanoResponse(tag, "content"))
        );
        setGeneratedContent(responses);

        const contentArray: string[] = []; 
        responses.forEach((content) => {
            contentArray.push(content);
        });
        
        saveContentData(contentArray);
    };

    return {
        interestData,
        generatedContent,
        loading,
        fetchGenerateContent
    }

}

    


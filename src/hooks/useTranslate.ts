/* eslint-disable @typescript-eslint/no-explicit-any */
import { getTranslate } from "@/utils/getTranslate";
import { useEffect, useState } from "react";

export const useTranslate = (targetLanguage: string | null) => {
  const [translator, setTranslator] = useState<any>(null);

  useEffect(() => {
    if (!targetLanguage) {
      return;
    }
    const loadTranslator = async () => {
      const translatorPromise = await getTranslate(targetLanguage);
      if (translatorPromise) {
        setTranslator(await translatorPromise());
      }
    };

    loadTranslator();
  }, [targetLanguage]);

  return translator;
};

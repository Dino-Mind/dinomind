/* eslint-disable @typescript-eslint/no-explicit-any */
export const getTranslate = async (targetLanguage: string) => {
  if (!('translation' in self) || !('createTranslator' in (self.translation as any))) {
    console.error(
      "[useTranslate] - Translation API is not available. Skipping translation."
    );
    return;
  }

  const sourceLanguage = "en";

  return async () => {
    const translator = await window.ai.translator.create({
      sourceLanguage,
      targetLanguage,
    });

    if (!translator) {
      console.error(
        "[useTranslate] - Translator is not available. Skipping translation."
      );
      return;
    }
    return translator;
  };

  
};

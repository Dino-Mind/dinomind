import {
  saveChatData,
  saveContentChatData,
  saveContentData,
  saveInterestData,
  saveTagData,
} from "../dataUtils";
import { ComponentType } from "../../types/componentType";
import { Message } from "../../types/messageType";
import { Content } from "@/hooks/useContentResponse";

type SaveDataFunction = {
  chatbox: (data: Message) => void;
  contentChat: (payload: { id: string; data: Message }) => void;
  interest: (data: string[]) => void;
  tag: (data: string[]) => void;
  content: (data: Content[]) => void;
  summarizeChat: (data: string) => void;
};

export const promptConfig: Record<
  ComponentType,
  {
    promptTemplate: string;
    contentPromptTemplate?: string;
    saveData: SaveDataFunction[ComponentType];
  }
> = {
  chatbox: {
    promptTemplate: `Analyze the user's input to respond correctly:

    If the user is asking a question, respond with a concise and clear answer without additional explanations.
    If the user intends to create content, generate  detailed and coherent response directly addressing their input.
    Ensure the response is formatted clearly and is directly usable without further adjustments.
    user's input: "{userMessage}"
    `,

    contentPromptTemplate: `Generate relevant and specific tags for the following content summary to enhance its discoverability and provide actionable insights for the user's query:

    Content Summary: "{summary}"

    User Question: "{userMessage}"

    Ensure the tags are precise and relevant to the summary and question. Avoid generic or overly broad terms that might dilute the specificity of the results. If appropriate tags do not exist, leave them uncreated.
    `,
    saveData: saveChatData,
  },
  interest: {
    promptTemplate: `
    Here is the URL I visited: "{userMessage}". 
    The purpose of this analysis is to create relevant content tags for this URL.

    The URL's title and metadata provide hints about its focus. Generate a summary that captures:
    1. The essence of the URL's content and purpose.
    2. A list of relevant tags that describe its core aspects.
`,
    saveData: saveInterestData,
  },

  tag: {
    promptTemplate: `
    You are content tag generator. You generate tags from given input with few words.
    Analyze the given text and generate one specific and concise category or tag that is highly relevant to the content, consisting of one to three words.
    Focus on accurately capturing the essence of the text without being overly generic or broad.
    Avoid platform names unless integral to the content, and ensure the tags are engaging, actionable, and relevant.

    - Examples:
      - If the link is about video contents output: "trending video ideas," "educational video ideas," or "popular tutorials about video making."
      - If the link is about social networking (like Facebook, instagram): "trending community discussions," "trending memes," or "trending social debates."
      - If the link is about instant messaging - chatting (like Whatsapp, Discord): "chat hacks," "trending discussions," or "daily buzz."
      - If the link is about a blog post : "interesting decorations," "parenting ideas," "photography tricks," or "food trends."
      - If the link is about a news website: "trending news," "interesting news," or "trending updates in sport."

    Input:
    "{userMessage}"
`,
    saveData: saveTagData,
  },

  content: {
    promptTemplate: `
    You are a creative content generator, skilled at crafting engaging and intriguing articles. 
      Write a captivating and original 2-paragraph article Based on the tags in this text:
      "{userMessage}"

      1. Start with a unique and compelling title that reflects the content's core idea. Avoid generic phrasing and instead create a title that sparks curiosity, offers value, or hints at a surprising perspective. 
      2. In the first paragraph, introduce the topic with an engaging hook or question, and provide context or background to intrigue the reader. 
      3. In the second paragraph, explore a unique perspective, practical applications, or fascinating insights related to the topic, delving deeper into its significance or appeal. 

      Ensure the content is:
      - Well-structured, with a logical flow between paragraphs.
      - Informative, creative, and tailored to captivate the intended audience.
      - Original and free from repetition.

      Conclude with a thought-provoking statement, actionable advice, or a call to action that leaves the reader inspired to learn more or take action.
  `,
    saveData: saveContentData,
  },

  contentChat: {
    promptTemplate: `
    If the user asks about or mentions the context and a valid "summary" is provided, use it to generate a clear, concise response within 100 words.
    
    If "No summary provided," inform the user that context data is unavailable, and offer a helpful general response or suggest they provide more details for a better answer.

    If the user's question is not directly about the context but is potentially relevant, guide the conversation back to the context if a valid summary is available. For unrelated questions, provide concise and helpful answers under 100 words.

      -user message : "{userMessage}"
      -summary: "{summary}"`,

    saveData: ({ id, data }: { id: string; data: Message }) =>
      saveContentChatData(id, data),
  },
};

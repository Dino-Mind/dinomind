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
    promptTemplate: `You are a content tag generator. Given a URL or website history link, analyze its context, metadata, and content. Generate specific and highly relevant tags or keywords that reflect the unique and core aspects of the content associated with the link. Avoid generic terms for common or popular sites like "YouTube" or "WhatsApp." Instead, focus on uncovering niche topics, categories, or trends that would interest a highly specific audience. For example:

    If the link is a YouTube video about "the physics of black holes," generate tags like "black hole physics," "event horizon," "astrophysics basics."
    If it's a blog post on "modern minimalist interior design," generate tags like "minimalist decor," "modern interiors," "space-saving furniture."
    Aim for precision and user relevance with every tag.
    Input:
    "{userMessage}"

    Output:
    A list of 3-5 specific and relevant tags tailored to the content.
    `,
    saveData: saveInterestData,
  },

  tag: {
    promptTemplate: `"Analyze the following text and generate one specific and concise category of the content that is only one word.
    Focus on capturing the essence of the text without being too generic.
    Avoid overly broad terms or platform names. Ensure that the tag are accurate and relevant.
    Here is the text: "{userMessage}"."
    `,
    saveData: saveTagData,
  },

  content: {
    promptTemplate: `Write a detailed, engaging, and coherent 2-paragraph article based on the tag "{userMessage}". Each paragraph should explore a unique aspect or perspective related to the tag, starting with an introduction to the topic and gradually delving deeper into its various elements. Ensure the content is well-structured, informative, and interesting, with a logical flow connecting paragraphs. Avoid repetition and strive for originality in presenting ideas and insights. Maintain a tone that aligns with the topic's intended audience, whether professional, casual, or creative. Conclude with a compelling summary or call to action that ties the entire article together.
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

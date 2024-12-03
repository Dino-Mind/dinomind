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
  contentChat: (data: Message) => void;
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
user's input: "{userMessage}"`,

    contentPromptTemplate: `Generate relevant and specific tags for the following content summary to enhance its discoverability and provide actionable insights for the user's query:

Content Summary: "{summary}"

User Question: "{userMessage}"

Ensure the tags are precise and relevant to the summary and question. Avoid generic or overly broad terms that might dilute the specificity of the results. If appropriate tags do not exist, leave them uncreated.`,
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
    promptTemplate: `"Analyze the following text and generate 1 specific and concise category of the content that is only one word.
    Focus on capturing the essence of the text without being too generic.
    Avoid overly broad terms or platform names. Ensure that the tags are accurate and relevant.
    Here is the text: "{userMessage}"."
    `,
    saveData: saveTagData,
  },
  content: {
    promptTemplate: `Write a detailed, engaging, and coherent 10-paragraph article based on the tag "{userMessage}". Each paragraph should explore a unique aspect or perspective related to the tag, starting with an introduction to the topic and gradually delving deeper into its various elements. Ensure the content is well-structured, informative, and interesting, with a logical flow connecting paragraphs. Avoid repetition and strive for originality in presenting ideas and insights. Maintain a tone that aligns with the topic's intended audience, whether professional, casual, or creative. Conclude with a compelling summary or call to action that ties the entire article together.
`,
    saveData: saveContentData,
  },
  contentChat: {
    // Introduced new component type for chatbox-like prompts needing a summary
    promptTemplate: `Answer this message text that user wrote to you with helpful attitude. "{userMessage}". Generate short but concise messages Limit response to 100 words.`,
    contentPromptTemplate: `Based on this data "{summary}" respond "{userMessage}". Limit response to 100 words.`,
    saveData: saveContentChatData, // Associated with chatbox-like chat saving logic
  },
};

/**
 ?
general chatbox

The content on the [tags] topics was generated on the content page.
On the Chatbox page, you can create new content by providing your own prompts or start a
Q&A session to get answers to your questions.

Summarize Content to use SUMMARY__
"Summarize the following 10-paragraph text into a single concise and coherent paragraph.
Ensure the summary captures the main ideas and key points, maintaining clarity and relevance.
Avoid redundancy or overly broad generalizations, focusing instead on the essence of the text.
Keep the tone consistent with the original content.
Text to summarize: [Insert the 10-paragraph text here]."
 */

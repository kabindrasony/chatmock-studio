
import { GoogleGenAI } from "@google/genai";

// Ensure we have a safe way to access the API key without crashing
const getApiKey = () => {
  try {
    return process.env.API_KEY || '';
  } catch (e) {
    return '';
  }
};

const apiKey = getApiKey();
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateChatScript = async (sender: string, receiver: string, scenario: string) => {
  if (!ai) {
    console.error("Gemini API Client not initialized. API_KEY might be missing.");
    return "> [System]: Error - API Key not found. Please check your deployment settings.\n< [System]: Make sure process.env.API_KEY is defined.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a short fake chat script between ${sender} and ${receiver}. 
      Scenario: ${scenario}.
      Use the syntax:
      > for ${sender} (sender)
      < for ${receiver} (receiver)
      Example:
      > Hey, how are you?
      < I'm good!
      Only return the script lines, no extra text.`,
      config: {
        temperature: 0.8,
        topP: 0.95,
      },
    });
    return response.text?.trim() || '';
  } catch (error) {
    console.error("Gemini Error:", error);
    return "";
  }
};

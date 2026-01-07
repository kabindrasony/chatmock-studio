
import { GoogleGenAI } from "@google/genai";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateChatScript = async (sender: string, receiver: string, scenario: string) => {
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
    // The GenerateContentResponse features a text property (not a method).
    return response.text?.trim() || '';
  } catch (error) {
    console.error("Gemini Error:", error);
    return "";
  }
};

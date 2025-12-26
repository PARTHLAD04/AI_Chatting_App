import OpenAI from "openai";

const client = new OpenAI({
  apiKey: "", // ✅ use env variable
  baseURL: "https://router.huggingface.co/v1"
});

export const getAIResponse = async (messages) => {
  try {
    // Keep last 10 messages to avoid token issues
    const recentMessages = messages.slice(-10);

    const completion = await client.chat.completions.create({
      model: "HuggingFaceH4/zephyr-7b-beta:featherless-ai",
      messages: [
        {
          role: "system",
          content: "You are a helpful AI assistant."
        },
        ...recentMessages
      ]
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("AI Error:", error.message);
    return "Sorry, something went wrong with the AI.";
  }
};


import OpenAI from "openai";

// Initialize OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "", // Use the API key from the environment variable
});

/**
 * Generate a random DnD encounter using ChatGPT.
 *
 * @param location - The current location (e.g., "Swamp", "Mountain").
 * @returns A promise resolving to the encounter description.
 */
export async function generateEncounter(location: string): Promise<string> {
  try {
    const prompt = `Generate a random DnD encounter suitable for a location called "${location}". Provide a concise description that includes an engaging setting, NPCs or monsters, and a twist.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4", // Adjust model version as needed
      messages: [
        {
          role: "system",
          content:
            "You are a creative storyteller for Dungeons and Dragons encounters.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 150, // Limit the token count for shorter responses
      temperature: 0.7, // Adjust creativity level
    });

    const encounter = response.choices[0]?.message?.content?.trim();
    return encounter || "No encounter generated.";
  } catch (error) {
    console.error("Error generating encounter:", error);
    throw new Error("Failed to generate encounter.");
  }
}

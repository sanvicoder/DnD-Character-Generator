import { defineFlow } from '@genkit-ai/flow';
import { genkit } from 'genkit';
import { googleAI, gemini20Flash } from '@genkit-ai/googleai';
import { characterInputSchema, characterOutputSchema } from '../src/utils/zodSchemas';

const ai = genkit({
  plugins: [googleAI()],
  model: gemini20Flash,
});

export const generateCharacter = defineFlow(
  {
    name: 'generateCharacter',
    inputSchema: characterInputSchema,
    outputSchema: characterOutputSchema,
  },
  async (input) => {
    const prompt = `
Create a rich, detailed Dungeons & Dragons character with the following parameters:
- Name: ${input.name || '[Generate a thematic name]'}
- Race: ${input.race}
- Class: ${input.clazz}
- Background: ${input.background}

For the personality section:
- Provide 3-5 distinct personality traits that make this character unique
- Include both strengths and flaws
- Consider how their race, class and background would shape their worldview
- Describe their general demeanor, communication style, and what motivates them
- Include any quirks, habits, or notable behaviors

For the backstory section:
- Create a compelling narrative explaining how they became an adventurer
- Include formative experiences that shaped their abilities and outlook
- Incorporate their background occupation/specialty meaningfully
- Add at least one significant relationship or connection
- Include a current goal or ambition that drives them
- Consider how their race's culture and history influences their story

Format the response as two clearly separated sections labeled "Personality:" and "Backstory:" with detailed, engaging content in each.
`;

    const result = await ai.generate(prompt);
    
    // Process the response to extract personality and backstory
    const fullResponse = result.text.trim();
    
    // Find the index of "Backstory:" after "Personality:"
    const personalityIndex = fullResponse.indexOf("Personality:");
    const backstoryIndex = fullResponse.indexOf("Backstory:", personalityIndex);
    
    let personality = "";
    let backstory = "";

    if (personalityIndex !== -1 && backstoryIndex !== -1) {
      // Extract sections if both headers are found
      personality = fullResponse.substring(personalityIndex + "Personality:".length, backstoryIndex).trim();
      backstory = fullResponse.substring(backstoryIndex + "Backstory:".length).trim();
    } else if (personalityIndex !== -1) {
      // If only personality is found, make a best guess at splitting the content
      const content = fullResponse.substring(personalityIndex + "Personality:".length).trim();
      const paragraphs = content.split('\n\n');
      
      if (paragraphs.length > 1) {
        personality = paragraphs[0].trim();
        backstory = paragraphs.slice(1).join('\n\n').trim();
      } else {
        personality = content;
        backstory = "No backstory provided.";
      }
    } else {
      // Fallback if formatting is unexpected
      const parts = fullResponse.split('\n\n');
      personality = parts[0] || "Mysterious and undefined.";
      backstory = parts.slice(1).join('\n\n') || "Their past remains shrouded in mystery.";
    }

    return {
      ...input,
      personality,
      backstory,
    };
  }
);

import { GoogleGenAI } from "@google/genai";

export const generateConversionImage = async (
  value: number,
  startUnit: string,
  solution: number,
  targetUnit: string,
  grandeur: string,
  apiKey: string
): Promise<string> => {

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `Create a simple and clear educational diagram for a 10-year-old child, illustrating the conversion of ${value} ${startUnit} to ${solution} ${targetUnit}. The quantity is ${grandeur}. Use clear labels and simple graphics. For areas, show a grid. For volumes, show cubes. For lengths, show a line. The visual style should be friendly and colorful, like a school textbook illustration. Do not include any text other than the unit labels and numbers.`;

  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/png',
        aspectRatio: '16:9',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes = response.generatedImages[0].image.imageBytes;
      return `data:image/png;base64,${base64ImageBytes}`;
    }
    throw new Error("Aucune image n'a été générée.");
  } catch (error) {
    console.error("Erreur lors de la génération de l'image:", error);
    throw error;
  }
};

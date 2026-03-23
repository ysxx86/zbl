import { GoogleGenAI } from "@google/genai";
import fs from 'fs';
import path from 'path';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function run() {
  try {
    console.log('Generating Earth image...');
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: 'A highly realistic, beautiful, high-resolution image of planet Earth in space, isolated on a pure black background. Showing glowing blue atmosphere, vibrant green continents, and deep blue oceans. No text, no borders.',
      config: {
        imageConfig: { aspectRatio: "1:1" }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const publicDir = path.join(process.cwd(), 'public');
        if (!fs.existsSync(publicDir)) {
          fs.mkdirSync(publicDir);
        }
        fs.writeFileSync(path.join(publicDir, 'earth.png'), Buffer.from(part.inlineData.data, 'base64'));
        console.log('Earth image successfully saved to public/earth.png');
      }
    }
  } catch (error) {
    console.error('Error generating image:', error);
  }
}

run();

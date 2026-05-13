import { GoogleGenAI } from "@google/genai";
import { WeatherData } from "./weatherService.ts";

export async function getSmartSummary(data: WeatherData, locationName: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const prompt = `
    Analyze this weather data for ${locationName} and provide a concise, high-level clinical summary of conditions and any notable trends (e.g., incoming heatwave, sustained rain probability). Focus on the technical and analytical perspective.
    
    Current: ${data.current.temp}°C, ${data.current.condition}, Humidity: ${data.current.humidity}%, UV: ${data.current.uvIndex}
    Forecasted Daily Max/Min (next 7 days): ${data.daily.tempMax.slice(7).join(', ')} / ${data.daily.tempMin.slice(7).join(', ')}
    
    Format the response in 2-3 short, impactful sentences.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "Unable to generate summary.";
  } catch (err) {
    console.error("Gemini Error:", err);
    return "Weather analysis service temporarily unavailable.";
  }
}

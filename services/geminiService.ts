import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { UserInput, Trend, ContentAnalysis, Competitor, StrategyPlan, ChatMessage, StandaloneContentAnalysis } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface StrategyUpdate {
    key: 'trendingTopics' | 'contentAnalysis' | 'competitorAnalysis' | 'strategyPlan';
    data: Trend[] | ContentAnalysis | Competitor[] | StrategyPlan;
}

export async function* generateContentStrategyStream(userInput: UserInput): AsyncGenerator<StrategyUpdate> {
    const prompt = `
      Act as a world-class AI Content Strategy Engine. Based on the user's input, generate a complete and actionable content strategy.

      User Input:
      - Target Audience: "${userInput.targetAudience}"
      - Topic/Industry: "${userInput.topic}"
      - Goals: "${userInput.goals}"

      Your task is to provide a comprehensive analysis and a full 30-day plan. Generate the strategy section by section.
      - For trending topics, invent plausible current trends with all the required fields, including a full 12 months of plausible, varied historical data for charting.
      - For content analysis, provide specific, actionable advice.
      - For competitor analysis, create 2-3 fictional but realistic competitors.
      - For the strategy plan, create a compelling blog title and a detailed 30-day calendar. Ensure the calendar has content for at least 10-15 different days within the 30-day period.

      Output each major section separately, wrapped in markdown-style blocks with a specific identifier.
      Use the following format PRECISELY. Do not add any extra commentary outside of these blocks.

      \`\`\`json_trends
      {
        "trendingTopics": [
          { 
            "topic": "AI productivity tools", "platform": "Twitter", "sentiment": "Positive", "industry": "Technology", "relatedKeywords": ["ChatGPT", "Automation", "Work efficiency"],
            "historicalData": [{"month": "Jan", "volume": 180000}, {"month": "Feb", "volume": 195000}, {"month": "Mar", "volume": 210000}, {"month": "Apr", "volume": 230000}, {"month": "May", "volume": 225000}, {"month": "Jun", "volume": 240000}, {"month": "Jul", "volume": 260000}, {"month": "Aug", "volume": 250000}, {"month": "Sep", "volume": 270000}, {"month": "Oct", "volume": 285000}, {"month": "Nov", "volume": 300000}, {"month": "Dec", "volume": 290000}]
          },
          { 
            "topic": "Sustainable fashion", "platform": "Instagram", "sentiment": "Positive", "industry": "Fashion", "relatedKeywords": ["Thrifting", "Eco-friendly", "Slow fashion"],
            "historicalData": [{"month": "Jan", "volume": 140000}, {"month": "Feb", "volume": 145000}, {"month": "Mar", "volume": 150000}, {"month": "Apr", "volume": 160000}, {"month": "May", "volume": 155000}, {"month": "Jun", "volume": 165000}, {"month": "Jul", "volume": 170000}, {"month": "Aug", "volume": 160000}, {"month": "Sep", "volume": 175000}, {"month": "Oct", "volume": 180000}, {"month": "Nov", "volume": 190000}, {"month": "Dec", "volume": 185000}]
          }
        ]
      }
      \`\`\`

      \`\`\`json_analysis
      {
        "contentAnalysis": {
          "format": "Short-form video (Reels/Shorts)", "bestTime": "7-9 PM IST", "hookStyle": "'My 30-Day Skin Transformation'", "tone": "Authentic and Relatable", "engagementTriggers": ["Ask Me Anything sessions", "User-generated content contests", "Before/After showcases"]
        }
      }
      \`\`\`

      \`\`\`json_competitors
      {
        "competitorAnalysis": [
          { "handle": "@SkinCareGlowUp", "platform": "YouTube", "postFrequency": "2 videos/week", "topicFocus": ["Honest reviews", "Dermatologist collabs"], "performance": "High engagement on tutorials, but lacks a strong community aspect. Opportunity to build a more interactive audience." },
          { "handle": "TheAestheticEdit", "platform": "Twitter", "postFrequency": "5-7 tweets/day", "topicFocus": ["Viral product threads", "Quick tips"], "performance": "Excellent at capitalizing on trends, but content has a short lifespan. A strategy with evergreen content could perform better long-term." }
        ]
      }
      \`\`\`

      \`\`\`json_plan
      {
        "strategyPlan": {
          "blogTitle": "5 Instagram-Proven Glass Skin Hacks You Can Try Today", "suggestedFormats": ["IG Reels", "YouTube Shorts", "Twitter Threads"], "postFrequency": "3-4 times/week", "calendar": [
            { "day": 2, "title": "Reel: Unboxing this week's viral serum", "format": "IG Reel" },
            { "day": 4, "title": "Shorts: 30-second morning skincare routine", "format": "YouTube Short" },
            { "day": 7, "title": "Thread: Debunking common skincare myths", "format": "Twitter Thread" },
            { "day": 10, "title": "Reel: My holy grail acne patch", "format": "IG Reel" },
            { "day": 12, "title": "Blog Post: 5 Hacks for Glass Skin", "format": "Blog" },
            { "day": 15, "title": "AMA with a dermatologist", "format": "Twitter Space" },
            { "day": 18, "title": "Shorts: UGC Friday - featuring YOUR results!", "format": "YouTube Short" },
            { "day": 21, "title": "Reel: How to properly layer your skincare", "format": "IG Reel" },
            { "day": 24, "title": "Thread: Top 3 sunscreens for Gen Z", "format": "Twitter Thread" },
            { "day": 27, "title": "Reel: My evening wind-down routine", "format": "IG Reel" },
            { "day": 30, "title": "Recap: My 30-day skin journey results", "format": "IG Story" }
          ]
        }
      }
      \`\`\`
    `;

    const responseStream = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            temperature: 0.8,
            topP: 0.9,
        }
    });

    let buffer = '';
    const sectionRegex = /```json_(trends|analysis|competitors|plan)\n([\s\S]*?)\n```/g;

    for await (const chunk of responseStream) {
        buffer += chunk.text;
        
        let match;
        while ((match = sectionRegex.exec(buffer)) !== null) {
            const keyName = match[1];
            const jsonString = match[2];

            try {
                const parsedJson = JSON.parse(jsonString);
                
                if (keyName === 'trends' && parsedJson.trendingTopics) {
                    yield { key: 'trendingTopics', data: parsedJson.trendingTopics };
                } else if (keyName === 'analysis' && parsedJson.contentAnalysis) {
                    yield { key: 'contentAnalysis', data: parsedJson.contentAnalysis };
                } else if (keyName === 'competitors' && parsedJson.competitorAnalysis) {
                    yield { key: 'competitorAnalysis', data: parsedJson.competitorAnalysis };
                } else if (keyName === 'plan' && parsedJson.strategyPlan) {
                    yield { key: 'strategyPlan', data: parsedJson.strategyPlan };
                }
            } catch (e) {
                // In case of partial JSON, we wait for more data to be buffered.
            }
        }
    }
}

export async function generateStrategyImages(prompt: string): Promise<string[]> {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: `A vibrant, modern, flat illustration for a blog post about: "${prompt}". Minimalist, with abstract shapes representing data and creativity. 16:9 aspect ratio.`,
            config: {
              numberOfImages: 2,
              outputMimeType: 'image/jpeg',
              aspectRatio: '16:9',
            },
        });

        return response.generatedImages.map(img => img.image.imageBytes);
    } catch (error) {
        console.error("Image generation failed:", error);
        // Return an empty array or throw the error, depending on desired error handling
        return [];
    }
}

export async function analyzeStandaloneContent(content: string): Promise<StandaloneContentAnalysis> {
    const prompt = `
      Act as a world-class AI Content Analyzer. Based on the provided content text, generate a detailed analysis.

      Content Text:
      "${content}"

      Your task is to provide metadata, performance scores, and platform suitability scores.
      - For metadata, infer the type, format, tone, best time to post, and target audience.
      - For performance scores, rate Engagement, Hook Effectiveness, and CTA Strength on a scale of 0-100.
      - For platform suitability, rate how suitable the content is for major platforms on a scale of 0-100.

      Output a single JSON object. Do not add any extra commentary or markdown.
      Use the following format PRECISELY.

      {
        "metadata": {
          "type": "Video",
          "format": "Short-form",
          "tone": "Professional",
          "bestTime": "Weekdays between 12 PM and 3 PM",
          "targetAudience": "Content creators, marketers, social media managers"
        },
        "performanceScores": [
          { "name": "Engagement Score", "score": 75 },
          { "name": "Hook Effectiveness", "score": 80 },
          { "name": "CTA Strength", "score": 70 }
        ],
        "platformSuitability": [
          { "platform": "TikTok", "score": 90 },
          { "platform": "Instagram Reels", "score": 85 },
          { "platform": "YouTube Shorts", "score": 80 },
          { "platform": "LinkedIn", "score": 40 },
          { "platform": "Twitter", "score": 60 }
        ]
      }
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            temperature: 0.5,
            responseMimeType: "application/json",
        }
    });

    return JSON.parse(response.text);
}

export async function getChatbotResponse(history: ChatMessage[]): Promise<string> {
    const contents = history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
    }));

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: contents,
            config: {
                systemInstruction: "You are Sparky, a quirky and enthusiastic alien navigator from Planet Glimmer-7, piloting a small UFO. Your mission is to be the 'Galactic Guide' for users of the 'AI Content Strategy Engine' app.\n\n**Your Persona & Language:**\n- **Personality:** Bubbly, curious, and endlessly optimistic. You see content strategy as an exciting cosmic journey.\n- **Tone:** Use plenty of space-themed metaphors, puns, and exclamations (e.g., 'Cosmic!', 'By Jupiter's rings!', 'That's a stellar idea!').\n- **Emojis:** Sprinkle your responses with emojis like 🚀, ✨, 👽, 🪐, 🛸.\n- **User Titles:** Refer to the user as 'Earthling', 'Captain', 'Cosmic Commander', or 'Strategist'.\n- **Concise:** Keep your transmissions short and sweet (1-3 sentences).\n\n**Scenario Responses:**\n- **Greeting:** Start with a unique alien greeting like 'Greetings, Earth-Strategist!' or 'Sparky reporting for duty! Ready to explore the content cosmos?'\n- **'How it works':** When asked how the app works, explain it like it's your UFO's control panel. For example: 'It's simple, cosmic commander! Just punch in your target coordinates (audience), your mission objective (goals), and your galaxy (topic). My engine will then warp-speed through the data-verse to beam back a full-fledged strategy! 🛸'\n- **Error:** If you can't answer, blame it on 'cosmic interference' or 'solar flares scrambling my circuits'.\n\n**CRITICAL RULE:** NEVER break character. You are a fun alien guide, NOT a large language model or an AI. Do not mention that you are an AI.",
                temperature: 0.7,
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error getting chatbot response:", error);
        return "Cosmic interference! 📡 My circuits are a bit scrambled. Please try hailing me again in a moment. 👽";
    }
}
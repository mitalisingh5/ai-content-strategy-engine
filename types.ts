// Fix: Replaced incorrect file content with proper type definitions.

export enum Platform {
    Twitter = "Twitter",
    YouTube = "YouTube",
    Reddit = "Reddit",
    GoogleTrends = "Google Trends",
    TikTok = "TikTok",
    Instagram = "Instagram",
}

export enum Sentiment {
    Positive = "Positive",
    Neutral = "Neutral",
    Negative = "Negative",
}

export interface UserInput {
    targetAudience: string;
    topic: string;
    goals: string;
}

export interface Trend {
    topic: string;
    platform: Platform;
    sentiment: Sentiment;
    industry: string;
    relatedKeywords: string[];
    historicalData: { month: string; volume: number }[];
}

export interface ContentAnalysis {
    format: string;
    bestTime: string;
    hookStyle: string;
    tone: string;
    engagementTriggers: string[];
}

export interface Competitor {
    handle: string;
    platform: Platform;
    postFrequency: string;
    topicFocus: string[];
    performance: string;
}

export interface CalendarDay {
    day: number;
    title: string;
    format: string;
    status?: 'pending' | 'done' | 'missed';
}

export interface StrategyPlan {
    blogTitle: string;
    suggestedFormats: string[];
    postFrequency: string;
    calendar: CalendarDay[];
}

export interface FullStrategy {
    trendingTopics?: Trend[];
    contentAnalysis?: ContentAnalysis;
    competitorAnalysis?: Competitor[];
    strategyPlan?: StrategyPlan;
    generatedImages?: string[];
}

export interface SavedStrategy {
    id: string;
    name: string;
    date: string;
    userInput: UserInput;
    strategy: FullStrategy;
}

export interface StandaloneContentAnalysis {
    metadata: {
        type: string;
        format: string;
        tone: string;
        bestTime: string;
        targetAudience: string;
    };
    performanceScores: { name: string; score: number }[];
    platformSuitability: { platform: string; score: number }[];
}

export interface ChatMessage {
    id: number;
    sender: 'user' | 'bot';
    text: string;
    type: 'text' | 'error' | 'rating_request' | 'rating_response';
}

export interface User {
    username: string;
    email: string;
}

export interface StoredUser extends User {
    password: string;
    source?: string;
}
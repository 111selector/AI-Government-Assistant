export enum Page {
    Home = 'HOME',
    Auth = 'AUTH',
    Dashboard = 'DASHBOARD',
}

export interface ChatMessage {
    id: string;
    userId: string;
    role: 'user' | 'model';
    text: string;
    language?: string;
    createdAt?: string;
    sources?: GroundingChunk[];
}

export interface GroundingChunk {
    web?: {
        uri?: string;
        title?: string;
    };
}

export interface CitizenReport {
    id: string;
    userId: string;
    title: string;
    category?: string;
    status: 'Submitted' | 'In Progress' | 'Resolved';
    createdAt: string;
}
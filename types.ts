
export enum Page {
    Home = 'HOME',
    Auth = 'AUTH',
    Dashboard = 'DASHBOARD',
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'model';
    text: string;
    sources?: GroundingChunk[];
}

export interface GroundingChunk {
    web: {
        uri: string;
        title: string;
    }
}
   
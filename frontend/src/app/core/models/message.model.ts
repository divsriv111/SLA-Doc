export interface Message {
    content: string;
    id: string;
    role: 'human'|'ai';
}
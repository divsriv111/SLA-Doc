import { Message } from "./message.model";

export interface Conversation {
    id: string;
    messages: Message[];
    pdf_id: string;
    title: string;
}
import { Source } from "./source.model";

export interface Chat {
    id: number;
    title: string;
    sources?: Source[];
    messages?: string[];
    date?: Date;
}
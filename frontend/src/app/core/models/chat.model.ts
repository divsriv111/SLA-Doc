import { Source } from "./source.model";

export interface Chat {
    id: number;
    name: string;
    sources?: Source[];
    messages?: string[];
    date?: Date;
}
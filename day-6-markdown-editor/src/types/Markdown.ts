export interface MarkdownDocument {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

export interface EditorState {
    content: string;
    wordCount: number;
    characterCount: number;
    readingTime: number;
}

export interface Theme {
    name: 'light' | 'dark';
    colors: {
        background: string;
        surface: string;
        text: string;
        textSecondary: string;
        primary: string;
        border: string;
    };
}
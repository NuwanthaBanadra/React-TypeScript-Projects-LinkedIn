export type DrawingTool = 'pen' | 'eraser' | 'line' | 'rectangle' | 'circle' | 'text';

export interface Point {
    x: number;
    y: number;
}

export interface DrawingState {
    tool: DrawingTool;
    color: string;
    brushSize: number;
    isDrawing: boolean;
    canvas: HTMLCanvasElement | null;
    context: CanvasRenderingContext2D | null;
    history: ImageData[];
    historyIndex: number;
}

export interface Shape {
    type: DrawingTool;
    start: Point;
    end: Point;
    color: string;
    brushSize: number;
}

export interface CanvasSize {
    width: number;
    height: number;
}
import React, { useRef, useEffect } from 'react';
import { Point, DrawingTool } from '../types/Drawing';
import './Canvas.css';

interface CanvasProps {
    tool: DrawingTool;
    color: string;
    brushSize: number;
    onDrawingStart: (point: Point) => void;
    onDrawingMove: (point: Point) => void;
    onDrawingEnd: () => void;
    onCanvasReady: (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => void;
    onClear: () => void;
}

const Canvas: React.FC<CanvasProps> = ({
    tool,
    color,
    brushSize,
    onDrawingStart,
    onDrawingMove,
    onDrawingEnd,
    onCanvasReady,
    onClear
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isDrawingRef = useRef(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        // Set canvas size
        const resizeCanvas = () => {
            const container = canvas.parentElement;
            if (container) {
                canvas.width = container.clientWidth;
                canvas.height = container.clientHeight - 60; // Account for header
            }

            // Set initial canvas style
            context.fillStyle = 'white';
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.lineCap = 'round';
            context.lineJoin = 'round';

            onCanvasReady(canvas, context);
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [onCanvasReady]);

    const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>): void => {
        isDrawingRef.current = true;
        const point = getMousePos(e);
        onDrawingStart(point);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>): void => {
        if (!isDrawingRef.current) return;

        const point = getMousePos(e);
        onDrawingMove(point);
    };

    const handleMouseUp = (): void => {
        if (!isDrawingRef.current) return;

        isDrawingRef.current = false;
        onDrawingEnd();
    };

    const handleMouseLeave = (): void => {
        if (isDrawingRef.current) {
            isDrawingRef.current = false;
            onDrawingEnd();
        }
    };

    return (
        <div className="canvas-container">
            <div className="canvas-header">
                <h3>Drawing Canvas</h3>
                <button onClick={onClear} className="clear-canvas-btn">
                    🧹 Clear Canvas
                </button>
            </div>
            <canvas
                ref={canvasRef}
                className="drawing-canvas"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                style={{
                    cursor: tool === 'eraser' ? `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${brushSize}" height="${brushSize}" viewBox="0 0 ${brushSize} ${brushSize}"><circle cx="${brushSize / 2}" cy="${brushSize / 2}" r="${brushSize / 2 - 1}" fill="white" stroke="black" stroke-width="1"/></svg>') ${brushSize / 2} ${brushSize / 2}, auto` : 'crosshair'
                }}
            />
        </div>
    );
};

export default Canvas;
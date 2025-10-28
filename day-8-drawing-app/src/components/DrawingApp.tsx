import React, { useState, useCallback, useEffect } from 'react';
import { DrawingState, Point, DrawingTool } from '../types/Drawing';
import Canvas from './Canvas';
import Toolbar from './Toolbar';
import ExportMenu from './ExportMenu';
import './DrawingApp.css';

const DrawingApp: React.FC = () => {
    const [drawingState, setDrawingState] = useState<DrawingState>({
        tool: 'pen',
        color: '#000000',
        brushSize: 5,
        isDrawing: false,
        canvas: null,
        context: null,
        history: [],
        historyIndex: -1
    });

    const [startPoint, setStartPoint] = useState<Point | null>(null);
    const [tempCanvas, setTempCanvas] = useState<HTMLCanvasElement | null>(null);

    // Initialize temporary canvas for preview
    useEffect(() => {
        const temp = document.createElement('canvas');
        setTempCanvas(temp);
    }, []);

    // Save to history
    const saveToHistory = useCallback((context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        setDrawingState(prev => {
            const newHistory = prev.history.slice(0, prev.historyIndex + 1);
            newHistory.push(imageData);
            return {
                ...prev,
                history: newHistory,
                historyIndex: newHistory.length - 1
            };
        });
    }, []);

    // Handle canvas ready
    const handleCanvasReady = useCallback((canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
        setDrawingState(prev => ({ ...prev, canvas, context }));
        saveToHistory(context, canvas);
    }, [saveToHistory]);

    // Handle drawing start
    const handleDrawingStart = useCallback((point: Point) => {
        const { context, tool } = drawingState;
        if (!context) return;

        setStartPoint(point);
        setDrawingState(prev => ({ ...prev, isDrawing: true }));

        if (tool === 'pen' || tool === 'eraser') {
            context.beginPath();
            context.moveTo(point.x, point.y);
        }
    }, [drawingState]);

    // Handle drawing move
    const handleDrawingMove = useCallback((point: Point) => {
        const { context, tool, color, brushSize, isDrawing } = drawingState;
        if (!context || !isDrawing || !startPoint) return;

        context.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color;
        context.lineWidth = brushSize;
        context.lineCap = 'round';
        context.lineJoin = 'round';

        switch (tool) {
            case 'pen':
            case 'eraser':
                context.lineTo(point.x, point.y);
                context.stroke();
                break;

            case 'line':
                // Draw temporary line
                if (tempCanvas) {
                    const tempContext = tempCanvas.getContext('2d');
                    if (tempContext && drawingState.canvas) {
                        tempContext.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
                        tempCanvas.width = drawingState.canvas.width;
                        tempCanvas.height = drawingState.canvas.height;

                        tempContext.strokeStyle = color;
                        tempContext.lineWidth = brushSize;
                        tempContext.setLineDash([5, 5]);
                        tempContext.beginPath();
                        tempContext.moveTo(startPoint.x, startPoint.y);
                        tempContext.lineTo(point.x, point.y);
                        tempContext.stroke();
                        tempContext.setLineDash([]);
                    }
                }
                break;

            case 'rectangle':
                if (tempCanvas && drawingState.canvas) {
                    const tempContext = tempCanvas.getContext('2d');
                    if (tempContext) {
                        tempContext.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
                        tempCanvas.width = drawingState.canvas.width;
                        tempCanvas.height = drawingState.canvas.height;

                        tempContext.strokeStyle = color;
                        tempContext.lineWidth = brushSize;
                        tempContext.setLineDash([5, 5]);
                        const width = point.x - startPoint.x;
                        const height = point.y - startPoint.y;
                        tempContext.strokeRect(startPoint.x, startPoint.y, width, height);
                        tempContext.setLineDash([]);
                    }
                }
                break;

            case 'circle':
                if (tempCanvas && drawingState.canvas) {
                    const tempContext = tempCanvas.getContext('2d');
                    if (tempContext) {
                        tempContext.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
                        tempCanvas.width = drawingState.canvas.width;
                        tempCanvas.height = drawingState.canvas.height;

                        tempContext.strokeStyle = color;
                        tempContext.lineWidth = brushSize;
                        tempContext.setLineDash([5, 5]);
                        const radius = Math.sqrt(
                            Math.pow(point.x - startPoint.x, 2) +
                            Math.pow(point.y - startPoint.y, 2)
                        );
                        tempContext.beginPath();
                        tempContext.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI);
                        tempContext.stroke();
                        tempContext.setLineDash([]);
                    }
                }
                break;

            default:
                break;
        }
    }, [drawingState, startPoint, tempCanvas]);

    // Handle drawing end
    const handleDrawingEnd = useCallback(() => {
        const { context, tool, color, brushSize, canvas } = drawingState;
        if (!context || !canvas || !startPoint) return;

        // Get the current mouse position from the last move event
        const currentPoint = startPoint; // This would need to be tracked differently

        switch (tool) {
            case 'line':
                context.strokeStyle = color;
                context.lineWidth = brushSize;
                context.beginPath();
                context.moveTo(startPoint.x, startPoint.y);
                context.lineTo(currentPoint.x, currentPoint.y);
                context.stroke();
                break;

            case 'rectangle':
                const width = currentPoint.x - startPoint.x;
                const height = currentPoint.y - startPoint.y;
                context.strokeStyle = color;
                context.lineWidth = brushSize;
                context.strokeRect(startPoint.x, startPoint.y, width, height);
                break;

            case 'circle':
                const radius = Math.sqrt(
                    Math.pow(currentPoint.x - startPoint.x, 2) +
                    Math.pow(currentPoint.y - startPoint.y, 2)
                );
                context.strokeStyle = color;
                context.lineWidth = brushSize;
                context.beginPath();
                context.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI);
                context.stroke();
                break;

            default:
                break;
        }

        // Clear temporary canvas
        if (tempCanvas) {
            const tempContext = tempCanvas.getContext('2d');
            tempContext?.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
        }

        // Save to history
        saveToHistory(context, canvas);

        setDrawingState(prev => ({ ...prev, isDrawing: false }));
        setStartPoint(null);
    }, [drawingState, startPoint, tempCanvas, saveToHistory]);

    // Handle clear canvas
    const handleClearCanvas = useCallback(() => {
        const { context, canvas } = drawingState;
        if (!context || !canvas) return;

        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);
        saveToHistory(context, canvas);
    }, [drawingState, saveToHistory]);

    // Handle undo
    const handleUndo = useCallback(() => {
        const { context, canvas, history, historyIndex } = drawingState;
        if (!context || !canvas || historyIndex <= 0) return;

        const newIndex = historyIndex - 1;
        context.putImageData(history[newIndex], 0, 0);
        setDrawingState(prev => ({ ...prev, historyIndex: newIndex }));
    }, [drawingState]);

    // Handle redo
    const handleRedo = useCallback(() => {
        const { context, canvas, history, historyIndex } = drawingState;
        if (!context || !canvas || historyIndex >= history.length - 1) return;

        const newIndex = historyIndex + 1;
        context.putImageData(history[newIndex], 0, 0);
        setDrawingState(prev => ({ ...prev, historyIndex: newIndex }));
    }, [drawingState]);

    // Handle export
    const handleExport = useCallback((format: string) => {
        const { canvas } = drawingState;
        if (!canvas) return;

        const dataUrl = canvas.toDataURL(`image/${format}`);
        const link = document.createElement('a');
        link.download = `drawing.${format}`;
        link.href = dataUrl;
        link.click();
    }, [drawingState]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'z':
                        e.preventDefault();
                        handleUndo();
                        break;
                    case 'y':
                        e.preventDefault();
                        handleRedo();
                        break;
                }
            } else {
                switch (e.key.toLowerCase()) {
                    case 'p':
                        setDrawingState(prev => ({ ...prev, tool: 'pen' }));
                        break;
                    case 'e':
                        setDrawingState(prev => ({ ...prev, tool: 'eraser' }));
                        break;
                    case 'l':
                        setDrawingState(prev => ({ ...prev, tool: 'line' }));
                        break;
                    case 'r':
                        setDrawingState(prev => ({ ...prev, tool: 'rectangle' }));
                        break;
                    case 'c':
                        setDrawingState(prev => ({ ...prev, tool: 'circle' }));
                        break;
                }
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [handleUndo, handleRedo]);

    return (
        <div className="drawing-app">
            <div className="app-header">
                <h1>🎨 Drawing App</h1>
                <p>Create amazing artwork with various tools and colors</p>
                <ExportMenu
                    canvas={drawingState.canvas}
                    onSave={handleExport}
                />
            </div>

            <div className="app-content">
                <div className="sidebar">
                    <Toolbar
                        currentTool={drawingState.tool}
                        onToolChange={(tool) => setDrawingState(prev => ({ ...prev, tool }))}
                        brushSize={drawingState.brushSize}
                        onBrushSizeChange={(size) => setDrawingState(prev => ({ ...prev, brushSize: size }))}
                        color={drawingState.color}
                        onColorChange={(color) => setDrawingState(prev => ({ ...prev, color }))}
                        onUndo={handleUndo}
                        onRedo={handleRedo}
                        canUndo={drawingState.historyIndex > 0}
                        canRedo={drawingState.historyIndex < drawingState.history.length - 1}
                    />
                </div>

                <div className="main-content">
                    <Canvas
                        tool={drawingState.tool}
                        color={drawingState.color}
                        brushSize={drawingState.brushSize}
                        onDrawingStart={handleDrawingStart}
                        onDrawingMove={handleDrawingMove}
                        onDrawingEnd={handleDrawingEnd}
                        onCanvasReady={handleCanvasReady}
                        onClear={handleClearCanvas}
                    />
                </div>
            </div>

            <div className="app-footer">
                <div className="current-tool">
                    Current Tool: <strong>{drawingState.tool}</strong>
                </div>
                <div className="shortcut-hint">
                    💡 Use keyboard shortcuts for quick tool switching
                </div>
            </div>
        </div>
    );
};

export default DrawingApp;
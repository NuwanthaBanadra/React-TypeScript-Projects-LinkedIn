import React from 'react';
import { DrawingTool } from '../types/Drawing';
import './Toolbar.css';

interface ToolbarProps {
    currentTool: DrawingTool;
    onToolChange: (tool: DrawingTool) => void;
    brushSize: number;
    onBrushSizeChange: (size: number) => void;
    color: string;
    onColorChange: (color: string) => void;
    onUndo: () => void;
    onRedo: () => void;
    canUndo: boolean;
    canRedo: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
    currentTool,
    onToolChange,
    brushSize,
    onBrushSizeChange,
    color,
    onColorChange,
    onUndo,
    onRedo,
    canUndo,
    canRedo
}) => {
    const tools: { tool: DrawingTool; icon: string; label: string }[] = [
        { tool: 'pen', icon: '✏️', label: 'Pen' },
        { tool: 'eraser', icon: '🧹', label: 'Eraser' },
        { tool: 'line', icon: '📏', label: 'Line' },
        { tool: 'rectangle', icon: '⬜', label: 'Rectangle' },
        { tool: 'circle', icon: '⭕', label: 'Circle' },
        { tool: 'text', icon: '🔤', label: 'Text' }
    ];

    const presetColors = [
        '#000000', '#FF0000', '#00FF00', '#0000FF',
        '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500',
        '#800080', '#FFC0CB', '#A52A2A', '#FFFFFF'
    ];

    const brushSizes = [1, 3, 5, 8, 12, 16, 20];

    return (
        <div className="toolbar">
            <div className="toolbar-section">
                <h4>Tools</h4>
                <div className="tool-buttons">
                    {tools.map(({ tool, icon, label }) => (
                        <button
                            key={tool}
                            onClick={() => onToolChange(tool)}
                            className={`tool-btn ${currentTool === tool ? 'active' : ''}`}
                            title={label}
                        >
                            <span className="tool-icon">{icon}</span>
                            <span className="tool-label">{label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="toolbar-section">
                <h4>Brush Size</h4>
                <div className="brush-sizes">
                    {brushSizes.map((size) => (
                        <button
                            key={size}
                            onClick={() => onBrushSizeChange(size)}
                            className={`brush-size-btn ${brushSize === size ? 'active' : ''}`}
                            title={`Size: ${size}px`}
                        >
                            <div
                                className="brush-preview"
                                style={{
                                    width: size * 2,
                                    height: size * 2,
                                    backgroundColor: currentTool === 'eraser' ? '#666' : color
                                }}
                            />
                        </button>
                    ))}
                </div>
                <div className="brush-size-display">
                    Size: {brushSize}px
                </div>
            </div>

            <div className="toolbar-section">
                <h4>Colors</h4>
                <div className="color-palette">
                    {presetColors.map((presetColor) => (
                        <button
                            key={presetColor}
                            onClick={() => onColorChange(presetColor)}
                            className={`color-btn ${color === presetColor ? 'active' : ''}`}
                            style={{ backgroundColor: presetColor }}
                            title={presetColor}
                        />
                    ))}
                </div>
                <div className="custom-color">
                    <label htmlFor="color-picker">Custom Color:</label>
                    <input
                        type="color"
                        id="color-picker"
                        value={color}
                        onChange={(e) => onColorChange(e.target.value)}
                        className="color-picker"
                    />
                </div>
            </div>

            <div className="toolbar-section">
                <h4>Actions</h4>
                <div className="action-buttons">
                    <button
                        onClick={onUndo}
                        disabled={!canUndo}
                        className="action-btn undo-btn"
                        title="Undo"
                    >
                        ↩️ Undo
                    </button>
                    <button
                        onClick={onRedo}
                        disabled={!canRedo}
                        className="action-btn redo-btn"
                        title="Redo"
                    >
                        ↪️ Redo
                    </button>
                </div>
            </div>

            <div className="toolbar-section shortcuts">
                <h4>Shortcuts</h4>
                <div className="shortcut-list">
                    <div className="shortcut-item">
                        <kbd>P</kbd> - Pen Tool
                    </div>
                    <div className="shortcut-item">
                        <kbd>E</kbd> - Eraser
                    </div>
                    <div className="shortcut-item">
                        <kbd>L</kbd> - Line
                    </div>
                    <div className="shortcut-item">
                        <kbd>R</kbd> - Rectangle
                    </div>
                    <div className="shortcut-item">
                        <kbd>C</kbd> - Circle
                    </div>
                    <div className="shortcut-item">
                        <kbd>Ctrl+Z</kbd> - Undo
                    </div>
                    <div className="shortcut-item">
                        <kbd>Ctrl+Y</kbd> - Redo
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Toolbar;
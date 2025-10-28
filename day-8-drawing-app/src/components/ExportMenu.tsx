import React, { useState } from 'react';
import './ExportMenu.css';

interface ExportMenuProps {
    canvas: HTMLCanvasElement | null;
    onSave: (format: string) => void;
}

const ExportMenu: React.FC<ExportMenuProps> = ({ canvas, onSave }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleExport = (format: string): void => {
        onSave(format);
        setIsOpen(false);
    };

    const exportOptions = [
        { format: 'png', label: 'PNG Image', icon: '🖼️' },
        { format: 'jpeg', label: 'JPEG Image', icon: '📷' },
        { format: 'webp', label: 'WebP Image', icon: '🌐' }
    ];

    return (
        <div className="export-menu">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="export-toggle"
                disabled={!canvas}
            >
                💾 Export
            </button>

            {isOpen && (
                <div className="export-dropdown">
                    {exportOptions.map((option) => (
                        <button
                            key={option.format}
                            onClick={() => handleExport(option.format)}
                            className="export-option"
                        >
                            <span className="export-icon">{option.icon}</span>
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ExportMenu;
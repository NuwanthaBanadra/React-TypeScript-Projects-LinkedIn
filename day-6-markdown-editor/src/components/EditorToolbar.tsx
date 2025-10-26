import React from 'react';
import './EditorToolbar.css';

interface EditorToolbarProps {
    onInsert: (syntax: string) => void;
    onClear: () => void;
    wordCount: number;
    charCount: number;
    readingTime: number;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
    onInsert,
    onClear,
    wordCount,
    charCount,
    readingTime
}) => {
    const formattingOptions = [
        { label: 'Heading 1', syntax: '# Heading 1\n' },
        { label: 'Heading 2', syntax: '## Heading 2\n' },
        { label: 'Bold', syntax: '**bold text**' },
        { label: 'Italic', syntax: '*italic text*' },
        { label: 'Link', syntax: '[text](https://)' },
        { label: 'Image', syntax: '![alt](https://)' },
        { label: 'Code', syntax: '`code`' },
        { label: 'List', syntax: '- List item\n' },
        { label: 'Quote', syntax: '> Quote\n' },
        { label: 'Table', syntax: '| Header | Header |\n| ------ | ------ |\n| Cell   | Cell   |\n' }
    ];

    return (
        <div className="editor-toolbar">
            <div className="toolbar-section">
                <h4>Formatting</h4>
                <div className="formatting-buttons">
                    {formattingOptions.map((option) => (
                        <button
                            key={option.label}
                            onClick={() => onInsert(option.syntax)}
                            className="format-btn"
                            title={option.label}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="toolbar-section">
                <h4>Document Stats</h4>
                <div className="document-stats">
                    <div className="stat">
                        <span className="stat-label">Words:</span>
                        <span className="stat-value">{wordCount}</span>
                    </div>
                    <div className="stat">
                        <span className="stat-label">Characters:</span>
                        <span className="stat-value">{charCount}</span>
                    </div>
                    <div className="stat">
                        <span className="stat-label">Reading Time:</span>
                        <span className="stat-value">{readingTime} min</span>
                    </div>
                </div>
            </div>

            <div className="toolbar-actions">
                <button onClick={onClear} className="clear-btn">
                    Clear Document
                </button>
            </div>
        </div>
    );
};

export default EditorToolbar;
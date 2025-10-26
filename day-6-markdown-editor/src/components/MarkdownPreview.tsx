import React from 'react';
import { marked } from 'marked';
import './MarkdownPreview.css';

interface MarkdownPreviewProps {
    content: string;
    theme: 'light' | 'dark';
}

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content, theme }) => {
    // Configure marked options (updated for newer versions)
    marked.setOptions({
        breaks: true,
        gfm: true
    });

    const getMarkdownText = (): string => {
        if (!content.trim()) {
            return '<div class="empty-preview">Start typing to see preview...</div>';
        }

        try {
            // marked() returns a string in newer versions, but we'll ensure it's synchronous
            const html = marked.parse(content) as string;
            return html;
        } catch (error) {
            console.error('Error parsing markdown:', error);
            return '<div class="error-preview">Error parsing markdown</div>';
        }
    };

    return (
        <div className={`markdown-preview ${theme}`}>
            <div className="preview-header">
                <h3>Preview</h3>
                <div className="preview-actions">
                    <span className="preview-info">Live Preview</span>
                </div>
            </div>
            <div
                className="preview-content"
                dangerouslySetInnerHTML={{ __html: getMarkdownText() }}
            />
        </div>
    );
};

export default MarkdownPreview;
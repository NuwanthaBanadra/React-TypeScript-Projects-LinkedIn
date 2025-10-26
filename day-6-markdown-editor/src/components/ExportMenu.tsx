import React, { useState } from 'react';
import { marked } from 'marked';
import './ExportMenu.css';

interface ExportMenuProps {
    content: string;
    title: string;
}

const ExportMenu: React.FC<ExportMenuProps> = ({ content, title }) => {
    const [isOpen, setIsOpen] = useState(false);

    const exportAsHTML = (): void => {
        const htmlContent = marked(content);
        const fullHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title || 'Markdown Document'}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
        h1, h2, h3 { color: #2c3e50; }
        code { background: #f4f4f4; padding: 2px 4px; border-radius: 3px; }
        pre { background: #f8f9fa; padding: 15px; border-radius: 5px; overflow-x: auto; }
        blockquote { border-left: 4px solid #3498db; padding-left: 15px; margin-left: 0; color: #666; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    ${htmlContent}
</body>
</html>`;

        const blob = new Blob([fullHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title || 'document'}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setIsOpen(false);
    };

    const exportAsMarkdown = (): void => {
        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title || 'document'}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setIsOpen(false);
    };

    const exportAsText = (): void => {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title || 'document'}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setIsOpen(false);
    };

    const copyToClipboard = async (): Promise<void> => {
        try {
            await navigator.clipboard.writeText(content);
            alert('Content copied to clipboard!');
            setIsOpen(false);
        } catch (err) {
            alert('Failed to copy to clipboard');
        }
    };

    return (
        <div className="export-menu">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="export-toggle"
            >
                📤 Export
            </button>

            {isOpen && (
                <div className="export-dropdown">
                    <button onClick={exportAsHTML} className="export-option">
                        💻 Export as HTML
                    </button>
                    <button onClick={exportAsMarkdown} className="export-option">
                        📝 Export as Markdown
                    </button>
                    <button onClick={exportAsText} className="export-option">
                        📄 Export as Text
                    </button>
                    <button onClick={copyToClipboard} className="export-option">
                        📋 Copy to Clipboard
                    </button>
                </div>
            )}
        </div>
    );
};

export default ExportMenu;
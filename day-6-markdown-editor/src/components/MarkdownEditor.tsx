import React, { useState, useEffect, useCallback } from 'react';
import { EditorState } from '../types/Markdown';
import MarkdownPreview from './MarkdownPreview';
import EditorToolbar from './EditorToolbar';
import ThemeToggle from './ThemeToggle';
import ExportMenu from './ExportMenu';
import './MarkdownEditor.css';

const MarkdownEditor: React.FC = () => {
    const [editorState, setEditorState] = useState<EditorState>({
        content: '# Welcome to Markdown Editor!\n\nStart writing your markdown here...',
        wordCount: 0,
        characterCount: 0,
        readingTime: 0
    });

    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [title, setTitle] = useState('Untitled Document');
    const [isEditingTitle, setIsEditingTitle] = useState(false);

    // Calculate document statistics
    const calculateStats = useCallback((text: string) => {
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const characters = text.length;
        const readingTime = Math.ceil(words / 200); // Average reading speed

        return { words, characters, readingTime };
    }, []);

    // Update stats when content changes
    useEffect(() => {
        const stats = calculateStats(editorState.content);
        setEditorState(prev => ({
            ...prev,
            wordCount: stats.words,
            characterCount: stats.characters,
            readingTime: stats.readingTime
        }));
    }, [editorState.content, calculateStats]);

    // Load from localStorage on component mount
    useEffect(() => {
        const savedContent = localStorage.getItem('markdown-content');
        const savedTitle = localStorage.getItem('markdown-title');
        const savedTheme = localStorage.getItem('markdown-theme');

        if (savedContent) {
            setEditorState(prev => ({ ...prev, content: savedContent }));
        }
        if (savedTitle) {
            setTitle(savedTitle);
        }
        if (savedTheme) {
            setTheme(savedTheme as 'light' | 'dark');
        }
    }, []);

    // Auto-save to localStorage
    useEffect(() => {
        localStorage.setItem('markdown-content', editorState.content);
        localStorage.setItem('markdown-title', title);
        localStorage.setItem('markdown-theme', theme);
    }, [editorState.content, title, theme]);

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
        setEditorState(prev => ({ ...prev, content: e.target.value }));
    };

    const handleInsertSyntax = (syntax: string): void => {
        const textarea = document.querySelector('.editor-textarea') as HTMLTextAreaElement;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = editorState.content.substring(start, end);

        let newContent = editorState.content;

        if (selectedText) {
            // Wrap selected text with syntax
            newContent =
                editorState.content.substring(0, start) +
                syntax.replace('text', selectedText) +
                editorState.content.substring(end);
        } else {
            // Insert syntax at cursor position
            newContent =
                editorState.content.substring(0, start) +
                syntax +
                editorState.content.substring(start);
        }

        setEditorState(prev => ({ ...prev, content: newContent }));

        // Focus back on textarea and set cursor position
        setTimeout(() => {
            textarea.focus();
            const newPosition = start + syntax.length;
            textarea.setSelectionRange(newPosition, newPosition);
        }, 0);
    };

    const handleClearDocument = (): void => {
        if (window.confirm('Are you sure you want to clear the document?')) {
            setEditorState({
                content: '',
                wordCount: 0,
                characterCount: 0,
                readingTime: 0
            });
        }
    };

    const handleTitleSave = (): void => {
        setIsEditingTitle(false);
    };

    const handleTitleKeyPress = (e: React.KeyboardEvent): void => {
        if (e.key === 'Enter') {
            handleTitleSave();
        }
    };

    return (
        <div className={`markdown-editor ${theme}`}>
            <div className="editor-header">
                <div className="header-left">
                    {isEditingTitle ? (
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onBlur={handleTitleSave}
                            onKeyPress={handleTitleKeyPress}
                            className="title-input"
                            autoFocus
                        />
                    ) : (
                        <h1
                            className="document-title"
                            onClick={() => setIsEditingTitle(true)}
                            title="Click to edit title"
                        >
                            {title}
                        </h1>
                    )}
                </div>

                <div className="header-right">
                    <ThemeToggle theme={theme} onThemeChange={setTheme} />
                    <ExportMenu content={editorState.content} title={title} />
                </div>
            </div>

            <div className="editor-container">
                <div className="editor-sidebar">
                    <EditorToolbar
                        onInsert={handleInsertSyntax}
                        onClear={handleClearDocument}
                        wordCount={editorState.wordCount}
                        charCount={editorState.characterCount}
                        readingTime={editorState.readingTime}
                    />
                </div>

                <div className="editor-main">
                    <div className="editor-panel">
                        <div className="panel-header">
                            <h3>Editor</h3>
                            <span className="panel-info">Markdown Syntax</span>
                        </div>
                        <textarea
                            className="editor-textarea"
                            value={editorState.content}
                            onChange={handleContentChange}
                            placeholder="Start writing your markdown here..."
                            spellCheck="false"
                        />
                    </div>

                    <div className="preview-panel">
                        <MarkdownPreview
                            content={editorState.content}
                            theme={theme}
                        />
                    </div>
                </div>
            </div>

            <div className="editor-footer">
                <div className="footer-stats">
                    <span>Words: {editorState.wordCount}</span>
                    <span>Characters: {editorState.characterCount}</span>
                    <span>Reading Time: {editorState.readingTime} min</span>
                </div>
                <div className="footer-info">
                    <span>💡 Use the toolbar for quick formatting</span>
                </div>
            </div>
        </div>
    );
};

export default MarkdownEditor;
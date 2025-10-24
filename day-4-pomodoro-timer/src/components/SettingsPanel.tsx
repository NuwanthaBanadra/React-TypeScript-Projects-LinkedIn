import React, { useState } from 'react';
import { TimerSettings } from '../types/Timer';
import './SettingsPanel.css';

interface SettingsPanelProps {
    settings: TimerSettings;
    onSettingsChange: (settings: TimerSettings) => void;
    isOpen: boolean;
    onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
    settings,
    onSettingsChange,
    isOpen,
    onClose,
}) => {
    const [localSettings, setLocalSettings] = useState<TimerSettings>(settings);

    const handleSave = (): void => {
        onSettingsChange(localSettings);
        onClose();
    };

    const handleCancel = (): void => {
        setLocalSettings(settings);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="settings-overlay">
            <div className="settings-panel">
                <div className="settings-header">
                    <h2>Timer Settings</h2>
                    <button onClick={handleCancel} className="close-btn">×</button>
                </div>

                <div className="settings-group">
                    <label className="setting-label">
                        Work Duration (minutes):
                        <input
                            type="number"
                            min="1"
                            max="60"
                            value={localSettings.workMinutes}
                            onChange={(e) => setLocalSettings({
                                ...localSettings,
                                workMinutes: parseInt(e.target.value) || 25
                            })}
                            className="setting-input"
                        />
                    </label>

                    <label className="setting-label">
                        Break Duration (minutes):
                        <input
                            type="number"
                            min="1"
                            max="30"
                            value={localSettings.breakMinutes}
                            onChange={(e) => setLocalSettings({
                                ...localSettings,
                                breakMinutes: parseInt(e.target.value) || 5
                            })}
                            className="setting-input"
                        />
                    </label>

                    <label className="setting-label">
                        Long Break Duration (minutes):
                        <input
                            type="number"
                            min="1"
                            max="60"
                            value={localSettings.longBreakMinutes}
                            onChange={(e) => setLocalSettings({
                                ...localSettings,
                                longBreakMinutes: parseInt(e.target.value) || 15
                            })}
                            className="setting-input"
                        />
                    </label>

                    <label className="setting-label">
                        Sessions before Long Break:
                        <input
                            type="number"
                            min="1"
                            max="10"
                            value={localSettings.sessionsBeforeLongBreak}
                            onChange={(e) => setLocalSettings({
                                ...localSettings,
                                sessionsBeforeLongBreak: parseInt(e.target.value) || 4
                            })}
                            className="setting-input"
                        />
                    </label>
                </div>

                <div className="settings-actions">
                    <button onClick={handleCancel} className="btn btn-cancel">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="btn btn-save">
                        Save Settings
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsPanel;
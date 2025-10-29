import React from 'react';
import { EqualizerBand } from '../types/Music';
import './Equalizer.css';

interface EqualizerProps {
    bands: EqualizerBand[];
    onBandChange: (frequency: number, gain: number) => void;
}

const Equalizer: React.FC<EqualizerProps> = ({ bands, onBandChange }) => {
    const handleGainChange = (frequency: number, gain: number): void => {
        onBandChange(frequency, gain);
    };

    return (
        <div className="equalizer">
            <h3>Equalizer</h3>
            <div className="equalizer-bands">
                {bands.map((band) => (
                    <div key={band.frequency} className="equalizer-band">
                        <div className="band-label">{band.label}</div>
                        <div className="slider-container">
                            <input
                                type="range"
                                min="-12"
                                max="12"
                                step="1"
                                value={band.gain}
                                onChange={(e) => handleGainChange(band.frequency, parseFloat(e.target.value))}
                                className="band-slider"
                            />
                        </div>
                        <div className="band-value">{band.gain}dB</div>
                    </div>
                ))}
            </div>
            <button
                className="reset-eq-btn"
                onClick={() => bands.forEach(band => handleGainChange(band.frequency, 0))}
            >
                🔄 Reset
            </button>
        </div>
    );
};

export default Equalizer;
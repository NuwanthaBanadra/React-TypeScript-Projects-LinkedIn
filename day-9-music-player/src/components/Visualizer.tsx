import React, { useRef, useEffect } from 'react';
import { AudioVisualizer } from '../types/Music';
import './Visualizer.css';

interface VisualizerProps {
    audioContext: AudioContext | null;
    audioElement: HTMLAudioElement | null;
    isPlaying: boolean;
}

const Visualizer: React.FC<VisualizerProps> = ({ audioContext, audioElement, isPlaying }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | undefined>(undefined);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const dataArrayRef = useRef<Uint8Array | null>(null);

    useEffect(() => {
        if (!audioContext || !audioElement) return;

        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaElementSource(audioElement);

        source.connect(analyser);
        analyser.connect(audioContext.destination);

        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        analyserRef.current = analyser;
        dataArrayRef.current = dataArray;

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            source.disconnect();
            analyser.disconnect();
        };
    }, [audioContext, audioElement]);

    useEffect(() => {
        if (!isPlaying || !analyserRef.current || !dataArrayRef.current) {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            return;
        }

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const draw = (): void => {
            if (!analyserRef.current || !dataArrayRef.current || !ctx) return;

            animationRef.current = requestAnimationFrame(draw);

            const analyser = analyserRef.current;
            const dataArray = dataArrayRef.current;

            analyser.getByteFrequencyData(dataArray);

            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / dataArray.length) * 2.5;
            let x = 0;

            for (let i = 0; i < dataArray.length; i++) {
                const barHeight = (dataArray[i] / 255) * canvas.height;

                const hue = i * 360 / dataArray.length;
                ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;

                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                x += barWidth + 1;
            }
        };

        draw();

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isPlaying]);

    return (
        <div className="visualizer">
            <h3>Audio Visualizer</h3>
            <canvas
                ref={canvasRef}
                width={800}
                height={200}
                className="visualizer-canvas"
            />
        </div>
    );
};

export default Visualizer;
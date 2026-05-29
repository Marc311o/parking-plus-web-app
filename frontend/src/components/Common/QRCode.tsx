import {useEffect, useRef, useState} from 'react';
import {qrcodegen, qrcodegen_ecc} from '../../utils/qrcodegen';

type QRCodeProps = {
    value: string;
    size?: number;
    padding?: number;
    color?: string;
    bgColor?: string;
    id?: string;
};

const QRCode = ({
                    value,
                    size = 180,
                    padding = 4,
                    color = '#000000',
                    bgColor = '#FFFFFF',
                    id,
                }: QRCodeProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        try {
            const qr = qrcodegen.QrCode.encodeText(value, qrcodegen_ecc.Ecc.MEDIUM);
            const scale = size / (qr.size + padding * 2);
            
            canvas.width = size;
            canvas.height = size;

            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, size, size);

            ctx.fillStyle = color;
            for (let y = 0; y < qr.size; y++) {
                for (let x = 0; x < qr.size; x++) {
                    if (qr.getModule(x, y)) {
                        ctx.fillRect(
                            (x + padding) * scale,
                            (y + padding) * scale,
                            scale,
                            scale
                        );
                    }
                }
            }
        } catch (err: any) {
            console.error('Failed to generate QR code', err);
            setError(err.message || 'Unknown error during QR generation');
        }
    }, [value, size, padding, color, bgColor]);

    if (error) {
        return (
            <div style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffebee', color: '#c62828', fontSize: 12, padding: 8, textAlign: 'center', borderRadius: 8 }}>
                QR Error: {error}
            </div>
        );
    }

    return (
        <canvas
            id={id}
            ref={canvasRef}
            style={{
                width: size,
                height: size,
                display: 'block',
                maxWidth: '100%',
                borderRadius: '8px',
            }}
        />
    );
};

export default QRCode;

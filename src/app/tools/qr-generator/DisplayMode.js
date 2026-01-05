"use client";

import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

export default function DisplayMode({ text, fgColor, bgColor, logo }) {
    const qrRef = useRef(null);

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-[9999]"
            style={{ backgroundColor: bgColor }}
        >
            <div ref={qrRef}>
                <QRCodeCanvas
                    value={text}
                    size={600}
                    fgColor={fgColor}
                    bgColor={bgColor}
                    level="H"
                    imageSettings={logo ? {
                        src: logo,
                        height: 100,
                        width: 100,
                        excavate: true,
                    } : undefined}
                    style={{
                        width: '100%',
                        height: 'auto',
                        maxWidth: '90vmin',
                        maxHeight: '90vmin'
                    }}
                />
            </div>
        </div>
    );
}

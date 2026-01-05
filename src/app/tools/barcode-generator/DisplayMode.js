"use client";
import React from 'react';
import Barcode from 'react-barcode';

export default function DisplayMode({ text, type }) {
    // Default to CODE128 if not provided
    const barcodeType = type || 'CODE128';
    const barcodeText = text || '123456789';

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-[9999]"
            style={{ backgroundColor: '#ffffff' }}
        >
            <div className="p-8 bg-white rounded-3xl shadow-2xl flex items-center justify-center">
                <Barcode
                    value={barcodeText}
                    format={barcodeType === 'UPC' ? 'UPC' : barcodeType}
                    width={2}
                    height={150}
                    displayValue={true}
                />
            </div>
        </div>
    );
}

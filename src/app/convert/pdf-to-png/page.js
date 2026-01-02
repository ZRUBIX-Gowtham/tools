import ImageConverter from '@/components/ImageConverter';

export const metadata = {
    title: "Free PDF to PNG Converter | ToolsHub",
    description: "Extract images from PDF files as PNG. Free tool.",
};

export default function PdfToPng() {
    return (
        <ImageConverter
            fromFormat="PDF"
            toFormat="PNG"
            title="PDF to PNG Converter"
            description="Extract pages from PDF files as high-quality PNG images. Perfect for presentations and editing."
        />
    );
}

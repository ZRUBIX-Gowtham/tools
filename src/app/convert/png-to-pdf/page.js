import ImageConverter from '@/components/ImageConverter';

export const metadata = {
    title: "Free PNG to PDF Converter | ToolsHub",
    description: "Save your PNG images as PDF documents. Free, fast and secure.",
};

export default function PngToPdf() {
    return (
        <ImageConverter
            fromFormat="PNG"
            toFormat="PDF"
            title="PNG to PDF Converter"
            description="Convert your PNG images to PDF documents. Perfect for creating printable documents from your images."
        />
    );
}

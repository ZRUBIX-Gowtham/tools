import ImageConverter from '@/components/ImageConverter';

export const metadata = {
    title: "Free PDF to JPG Converter | ToolsHub",
    description: "Convert PDF pages to JPG images. Free tool.",
};

export default function PdfToJpg() {
    return (
        <ImageConverter
            fromFormat="PDF"
            toFormat="JPG"
            title="PDF to JPG Converter"
            description="Convert PDF pages to JPG images. Perfect for extracting content from PDF documents."
        />
    );
}

import ImageConverter from '@/components/ImageConverter';

export const metadata = {
    title: "Free JPEG to PDF Converter | ToolsHub",
    description: "Quick photo to PDF conversion. Free, fast and secure.",
};

export default function JpegToPdf() {
    return (
        <ImageConverter
            fromFormat="JPEG"
            toFormat="PDF"
            title="JPEG to PDF Converter"
            description="Convert your JPEG photos to PDF documents. Quick and easy conversion for all your document needs."
        />
    );
}

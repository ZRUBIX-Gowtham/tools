import ImageConverter from '@/components/ImageConverter';

export const metadata = {
    title: "Free JPG to PDF Converter | ToolsHub",
    description: "Convert JPG images to PDF documents. Free tool.",
};

export default function JpgToPdf() {
    return (
        <ImageConverter
            fromFormat="JPG"
            toFormat="PDF"
            title="JPG to PDF Converter"
            description="Convert your JPG photos to PDF documents. Quick and easy conversion for printing and sharing."
        />
    );
}

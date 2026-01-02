import ImageConverter from '@/components/ImageConverter';

export const metadata = {
    title: "Free SVG to PDF Converter | ToolsHub",
    description: "Convert vector graphics to PDF documents. Free, fast and secure.",
};

export default function SvgToPdf() {
    return (
        <ImageConverter
            fromFormat="SVG"
            toFormat="PDF"
            title="SVG to PDF Converter"
            description="Convert your SVG vector graphics to PDF documents. Perfect for printing and sharing vector artwork."
        />
    );
}

import ImageConverter from '@/components/ImageConverter';

export const metadata = { title: "PNG to PDF | ToolsHub" };

export default function PngToPdf() {
    return <ImageConverter fromFormat="PNG" toFormat="PDF" title="PNG to PDF Converter" />;
}

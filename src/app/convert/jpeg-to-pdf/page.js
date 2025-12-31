import ImageConverter from '@/components/ImageConverter';
export const metadata = { title: "JPEG to PDF | ToolsHub" };
export default function JpegToPdf() {
    return <ImageConverter fromFormat="JPEG" toFormat="PDF" title="JPEG to PDF Converter" />;
}

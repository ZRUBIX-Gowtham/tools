import ImageConverter from '@/components/ImageConverter';
export const metadata = { title: "SVG to PDF | ToolsHub" };
export default function SvgToPdf() {
    return <ImageConverter fromFormat="SVG" toFormat="PDF" title="SVG to PDF Converter" />;
}

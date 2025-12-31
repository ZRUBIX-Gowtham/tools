import ImageConverter from '@/components/ImageConverter';
export const metadata = { title: "JPEG to PNG | ToolsHub" };
export default function JpegToPng() {
    return <ImageConverter fromFormat="JPEG" toFormat="PNG" title="JPEG to PNG Converter" />;
}

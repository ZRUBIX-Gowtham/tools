import ImageConverter from '@/components/ImageConverter';
export const metadata = { title: "JPEG to WebP | ToolsHub" };
export default function JpegToWebp() {
    return <ImageConverter fromFormat="JPEG" toFormat="WEBP" title="JPEG to WebP Converter" />;
}

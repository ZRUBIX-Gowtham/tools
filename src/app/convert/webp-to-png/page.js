import ImageConverter from '@/components/ImageConverter';
export const metadata = { title: "WebP to PNG | ToolsHub" };
export default function WebpToPng() {
    return <ImageConverter fromFormat="WEBP" toFormat="PNG" title="WebP to PNG Converter" />;
}

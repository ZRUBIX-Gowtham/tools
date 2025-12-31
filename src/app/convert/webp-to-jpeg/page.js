import ImageConverter from '@/components/ImageConverter';
export const metadata = { title: "WebP to JPEG | ToolsHub" };
export default function WebpToJpeg() {
    return <ImageConverter fromFormat="WEBP" toFormat="JPEG" title="WebP to JPEG Converter" />;
}

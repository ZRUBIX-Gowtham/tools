import ImageConverter from '@/components/ImageConverter';
export const metadata = { title: "WebP to JPG | ToolsHub" };
export default function WebpToJpg() {
    return <ImageConverter fromFormat="WEBP" toFormat="JPG" title="WebP to JPG Converter" />;
}

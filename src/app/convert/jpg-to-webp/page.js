import ImageConverter from '@/components/ImageConverter';
export const metadata = { title: "JPG to WebP | ToolsHub" };
export default function JpgToWebp() {
    return <ImageConverter fromFormat="JPG" toFormat="WEBP" title="JPG to WebP Converter" />;
}

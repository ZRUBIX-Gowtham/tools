import ImageConverter from '@/components/ImageConverter';
export const metadata = { title: "WebP to SVG | ToolsHub" };
export default function WebpToSvg() {
    return <ImageConverter fromFormat="WEBP" toFormat="SVG" title="WebP to SVG Converter" />;
}

import ImageConverter from '@/components/ImageConverter';
export const metadata = { title: "PNG to SVG | ToolsHub" };
export default function PngToSvg() {
    return <ImageConverter fromFormat="PNG" toFormat="SVG" title="PNG to SVG Converter" />;
}

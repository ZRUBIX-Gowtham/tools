import ImageConverter from '@/components/ImageConverter';
export const metadata = { title: "SVG to JPG | ToolsHub" };
export default function SvgToJpg() {
    return <ImageConverter fromFormat="SVG" toFormat="JPG" title="SVG to JPG Converter" />;
}

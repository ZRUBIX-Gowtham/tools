import ImageConverter from '@/components/ImageConverter';

export const metadata = {
    title: "Free SVG to JPG Converter | ToolsHub",
    description: "Convert vector illustrations to photo format. Free tool.",
};

export default function SvgToJpg() {
    return (
        <ImageConverter
            fromFormat="SVG"
            toFormat="JPG"
            title="SVG to JPG Converter"
            description="Convert your SVG vector illustrations to JPG photo format. Ideal for sharing on platforms that don't support SVG."
        />
    );
}

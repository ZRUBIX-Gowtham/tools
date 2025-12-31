import ImageConverter from '@/components/ImageConverter';

export const metadata = {
    title: "PNG to JPG Converter | ToolsHub",
    description: "Convert PNG images to JPG format for free with ToolsHub. High quality results, secure processing.",
};

export default function PngToJpg() {
    return (
        <ImageConverter
            fromFormat="PNG"
            toFormat="JPG"
            title="PNG to JPG Converter"
            description="Need to turn a transparent PNG into a high-quality JPG? Our tool handles the conversion in seconds while maintaining optimal image quality."
        />
    );
}

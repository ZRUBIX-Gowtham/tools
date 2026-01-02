import ImageConverter from '@/components/ImageConverter';

export const metadata = {
    title: "Free PNG to ICO Converter | ToolsHub",
    description: "Create favicon and icons from PNG images. Free ICO converter tool.",
};

export default function PngToIco() {
    return (
        <ImageConverter
            fromFormat="PNG"
            toFormat="ICO"
            title="PNG to ICO Converter"
            description="Create favicon and icon files from your PNG images. Perfect for website favicons and desktop icons."
        />
    );
}

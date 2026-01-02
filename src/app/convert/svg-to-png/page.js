import ImageConverter from '@/components/ImageConverter';

export const metadata = {
    title: "Free SVG to PNG Converter | ToolsHub",
    description: "Convert SVG vector graphics to PNG raster images. Free, high-resolution output.",
};

export default function SvgToPng() {
    return (
        <ImageConverter
            fromFormat="SVG"
            toFormat="PNG"
            title="SVG to PNG Converter"
            description="Convert your SVG vectors to high-resolution PNG images. Perfect for social media, presentations, or general use."
        />
    );
}

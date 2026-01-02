import ImageConverter from '@/components/ImageConverter';

export const metadata = {
    title: "Free PNG to SVG Converter | ToolsHub",
    description: "Convert raster PNG images to scalable SVG vectors. Free vectorization tool.",
};

export default function PngToSvg() {
    return (
        <ImageConverter
            fromFormat="PNG"
            toFormat="SVG"
            title="PNG to SVG Converter"
            description="Convert your PNG images to scalable vector graphics. Perfect for logos and illustrations that need to scale without losing quality."
        />
    );
}

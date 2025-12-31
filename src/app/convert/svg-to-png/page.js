import ImageConverter from '@/components/ImageConverter';

export const metadata = {
    title: "SVG to PNG Converter | ToolsHub",
    description: "Convert SVG vector graphics to PNG raster images. High-resolution output on ToolsHub.",
};

export default function SvgToPng() {
    return (
        <ImageConverter
            fromFormat="SVG"
            toFormat="PNG"
            title="SVG to PNG Converter"
            description="Need a raster version of your vector art? Convert SVG to high-resolution PNG for social media, presentations, or general use."
        />
    );
}

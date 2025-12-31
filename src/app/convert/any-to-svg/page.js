import ImageConverter from '@/components/ImageConverter';

export const metadata = {
    title: "Any Image to SVG Converter | ToolsHub",
    description: "Convert raster images (PNG, JPG, WebP) to SVG vectors. Free vectorization tool on ToolsHub.",
};

export default function AnyToSvg() {
    return (
        <ImageConverter
            fromFormat="ANY"
            toFormat="SVG"
            title="Any Image to SVG"
            description="Turn your photos and logos into scalable vector graphics (SVG). Upload any common image format and we'll handle the vectorization."
        />
    );
}

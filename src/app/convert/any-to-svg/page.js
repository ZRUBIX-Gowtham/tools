import ImageConverter from '@/components/ImageConverter';

export const metadata = {
    title: "Free Any Image to SVG Converter | ToolsHub",
    description: "Convert any raster image (PNG, JPG, WebP) to SVG vectors. Free vectorization tool.",
};

export default function AnyToSvg() {
    return (
        <ImageConverter
            fromFormat="ANY"
            toFormat="SVG"
            title="Any Image to SVG Converter"
            description="Turn your photos and logos into scalable vector graphics (SVG). Upload any common image format and we'll handle the vectorization."
        />
    );
}

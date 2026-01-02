import ImageConverter from '@/components/ImageConverter';

export const metadata = {
    title: "Free WebP to SVG Converter | ToolsHub",
    description: "Convert WebP images to scalable vector graphics. Free vectorization tool.",
};

export default function WebpToSvg() {
    return (
        <ImageConverter
            fromFormat="WEBP"
            toFormat="SVG"
            title="WebP to SVG Converter"
            description="Convert your WebP images to scalable SVG vectors. Perfect for creating scalable graphics from raster images."
        />
    );
}

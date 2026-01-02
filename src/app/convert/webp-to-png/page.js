import ImageConverter from '@/components/ImageConverter';

export const metadata = {
    title: "Free WebP to PNG Converter | ToolsHub",
    description: "Convert modern WebP format back to classic PNG. Free tool.",
};

export default function WebpToPng() {
    return (
        <ImageConverter
            fromFormat="WEBP"
            toFormat="PNG"
            title="WebP to PNG Converter"
            description="Convert WebP images to PNG format. Perfect for when you need wider compatibility with image viewers and editors."
        />
    );
}

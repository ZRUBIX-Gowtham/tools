import ImageConverter from '@/components/ImageConverter';

export const metadata = {
    title: "Free WebP to JPG Converter | ToolsHub",
    description: "Convert modern WebP format to standard JPG. Free tool.",
};

export default function WebpToJpg() {
    return (
        <ImageConverter
            fromFormat="WEBP"
            toFormat="JPG"
            title="WebP to JPG Converter"
            description="Convert WebP images to JPG format. Perfect for compatibility with all image viewers and editors."
        />
    );
}

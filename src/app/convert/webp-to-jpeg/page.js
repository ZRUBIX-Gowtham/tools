import ImageConverter from '@/components/ImageConverter';

export const metadata = {
    title: "Free WebP to JPEG Converter | ToolsHub",
    description: "Convert modern WebP format to standard JPEG. Free tool.",
};

export default function WebpToJpeg() {
    return (
        <ImageConverter
            fromFormat="WEBP"
            toFormat="JPEG"
            title="WebP to JPEG Converter"
            description="Convert WebP images to JPEG format. Great for sharing on platforms that don't support WebP."
        />
    );
}

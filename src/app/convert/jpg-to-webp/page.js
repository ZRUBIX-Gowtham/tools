import ImageConverter from '@/components/ImageConverter';

export const metadata = {
    title: "Free JPG to WebP Converter | ToolsHub",
    description: "Convert JPG images to modern WebP format. Free web optimization tool.",
};

export default function JpgToWebp() {
    return (
        <ImageConverter
            fromFormat="JPG"
            toFormat="WEBP"
            title="JPG to WebP Converter"
            description="Convert your JPG photos to WebP format. Reduce file sizes while maintaining excellent image quality."
        />
    );
}

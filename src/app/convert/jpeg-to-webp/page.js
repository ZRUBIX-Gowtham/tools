import ImageConverter from '@/components/ImageConverter';

export const metadata = {
    title: "Free JPEG to WebP Converter | ToolsHub",
    description: "Convert JPEG images to modern WebP format. Free tool for web optimization.",
};

export default function JpegToWebp() {
    return (
        <ImageConverter
            fromFormat="JPEG"
            toFormat="WEBP"
            title="JPEG to WebP Converter"
            description="Convert your JPEG photos to WebP format. Get smaller file sizes with better quality for web use."
        />
    );
}

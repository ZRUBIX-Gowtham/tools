import ImageConverter from '@/components/ImageConverter';

export const metadata = {
    title: "Free JPEG to PNG Converter | ToolsHub",
    description: "Convert JPEG images to transparent PNG format. Free tool.",
};

export default function JpegToPng() {
    return (
        <ImageConverter
            fromFormat="JPEG"
            toFormat="PNG"
            title="JPEG to PNG Converter"
            description="Convert your JPEG photos to PNG format. Perfect for when you need lossless quality or transparency support."
        />
    );
}

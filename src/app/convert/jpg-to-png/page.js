import ImageConverter from '@/components/ImageConverter';

export const metadata = {
    title: "Free JPG to PNG Converter | ToolsHub",
    description: "Convert JPG photos to PNG format. Free, high quality conversion.",
};

export default function JpgToPng() {
    return (
        <ImageConverter
            fromFormat="JPG"
            toFormat="PNG"
            title="JPG to PNG Converter"
            description="Convert your JPG photos to PNG format. Perfect for when you need a lossless format for further editing or web use."
        />
    );
}

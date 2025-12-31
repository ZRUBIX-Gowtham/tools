import ImageConverter from '@/components/ImageConverter';

export const metadata = {
    title: "PNG to WebP Converter | ToolsHub",
    description: "Convert PNG to the modern WebP format for better web performance. Free tool by ToolsHub.",
};

export default function PngToWebp() {
    return (
        <ImageConverter
            fromFormat="PNG"
            toFormat="WEBP"
            title="PNG to WebP Converter"
            description="Optimizing your website? Convert your PNG images to WebP to reduce file size and speed up page loading times without losing quality."
        />
    );
}

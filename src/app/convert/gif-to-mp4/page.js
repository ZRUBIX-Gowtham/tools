import ImageConverter from '@/components/ImageConverter';

export const metadata = {
    title: "Free GIF to MP4 Converter | ToolsHub",
    description: "Convert animated GIFs into efficient MP4 video files. Free tool.",
};

export default function GifToMp4() {
    return (
        <ImageConverter
            fromFormat="GIF"
            toFormat="MP4"
            title="GIF to MP4 Converter"
            description="Convert your animated GIFs into efficient MP4 video files. Perfect for social media and reducing file sizes."
        />
    );
}

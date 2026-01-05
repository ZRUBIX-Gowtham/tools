
import GeneratorMode from './GeneratorMode';
import DisplayMode from './DisplayMode';

export default async function QRGeneratorPage({ searchParams }) {
    const params = await searchParams;
    const nameParam = params?.name;
    const colorParam = params?.color;
    const bgcolorParam = params?.bgcolor;
    const logoParam = params?.logo;

    // Helper to ensure color has # prefix
    const normalizeColor = (color) => {
        if (!color) return undefined;
        return color.startsWith('#') ? color : `#${color}`;
    };

    const fgColor = normalizeColor(colorParam) || '#000000';
    const bgColor = normalizeColor(bgcolorParam) || '#ffffff';

    // If "name" parameter is present, we are in Display Mode
    // This server-side check prevents the "flash" of the generator UI
    if (nameParam) {
        // Next.js searchParams are automatically decoded, 
        // but existing logic used decodeURIComponent, so we keep text as is from params
        return (
            <DisplayMode
                text={nameParam}
                fgColor={fgColor}
                bgColor={bgColor}
                logo={logoParam}
            />
        );
    }

    // Otherwise, render the interactive Generator
    return (
        <GeneratorMode
            initialFgColor={fgColor}
            initialBgColor={bgColor}
        />
    );
}

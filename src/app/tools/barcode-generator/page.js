
import GeneratorMode from './GeneratorMode';
import DisplayMode from './DisplayMode';

export default async function BarcodeGeneratorPage({ searchParams }) {
    const params = await searchParams;
    const nameParam = params?.name;
    const typeParam = params?.type;

    const type = typeParam || 'CODE128';

    // If "name" parameter is present, we are in Display Mode
    if (nameParam) {
        return (
            <DisplayMode
                text={nameParam}
                type={type}
            />
        );
    }

    // Otherwise, render the interactive Generator
    return (
        <GeneratorMode
            initialText={nameParam}
            initialType={type}
        />
    );
}

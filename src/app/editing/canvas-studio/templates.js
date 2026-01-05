import Id1 from './Templates/Id1.png';
import Id2 from './Templates/Id2.png';

export const PRESET_TEMPLATES = [
    {
        id: 'the-grid',
        name: 'Event Showcase',
        thumbnail: Id1.src,
        aspectRatio: 'aspect-[3/4]',
        bg: '#000000',
        boxes: [
            { id: 'logo', type: 'text', content: 'BRAND LOGO', bg: '#8d7a6a', color: '#ffffff', x: 20, y: 20, width: 150, height: 150, fontSize: 24, fontWeight: '900', textAlign: 'center', borderRadius: 20 },
            { id: 'quote', type: 'text', content: '"Design is intelligence made visible."', bg: '#5e5449', color: '#ffffff', x: 20, y: 190, width: 150, height: 250, fontSize: 16, fontWeight: '400', textAlign: 'center', borderRadius: 20 },
            { id: 'profile', type: 'text', content: 'STEVE JOBS\nCo-founder, Apple', bg: '#3a3535', color: '#ffffff', x: 20, y: 460, width: 150, height: 120, fontSize: 14, fontWeight: '700', textAlign: 'center', borderRadius: 20 },
            { id: 'main-image', type: 'image', content: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop', x: 190, y: 20, width: 380, height: 560, borderRadius: 24 },
            { id: 'date', type: 'text', content: '05 JAN\nMonday, 2026', bg: '#2d2929', color: '#ffffff', x: 20, y: 600, width: 150, height: 180, fontSize: 22, fontWeight: '800', textAlign: 'center', borderRadius: 20 },
            { id: 'time', type: 'text', content: '03:00 PM\nonwards', bg: '#2d2929', color: '#ffffff', x: 190, y: 600, width: 180, height: 180, fontSize: 22, fontWeight: '800', textAlign: 'center', borderRadius: 20 },
            { id: 'action', type: 'text', content: 'BOOK\nNOW', bg: '#3a3535', color: '#ffffff', x: 390, y: 600, width: 180, height: 180, fontSize: 28, fontWeight: '900', textAlign: 'center', borderRadius: 20 }
        ]
    },
    {
        id: 'modern-blog',
        name: 'Modern Blog Cover',
        thumbnail: Id2.src,
        aspectRatio: 'aspect-[16/9]',
        bg: '#ffffff',
        boxes: [
            { id: 'bg-img', type: 'image', content: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200&auto=format&fit=crop', x: 400, y: 50, width: 750, height: 500, borderRadius: 12 },
            { id: 'tag', type: 'text', content: 'TECHNOLOGY', bg: '#3b82f6', color: '#ffffff', x: 50, y: 150, width: 150, height: 40, fontSize: 14, fontWeight: '900', textAlign: 'center', borderRadius: 4 },
            { id: 'title', type: 'text', content: 'THE FUTURE OF\nAI DESIGN TOOLS', bg: 'transparent', color: '#000000', x: 50, y: 210, width: 450, height: 200, fontSize: 48, fontWeight: '900', textAlign: 'left', borderRadius: 0 },
            { id: 'sub', type: 'text', content: 'Exploring the boundary between human creativity and machine precision.', bg: 'transparent', color: '#64748b', x: 50, y: 420, width: 400, height: 100, fontSize: 18, fontWeight: '500', textAlign: 'left', borderRadius: 0 }
        ]
    }
];

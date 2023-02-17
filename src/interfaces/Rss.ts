interface BaseRssItem {
    id: string;
    title: string;
    description: string;
    link: string;
    published: number;
    created: number;
    category: string[];
    enclosures: any[];
    media: {};
}

interface BusinessInsiderRssItem extends BaseRssItem {
    category: never[];
}

interface GhostRssItem extends BaseRssItem {
    author: string;
    content: string;
    enclosures: { url: string; medium: 'image' }[];
    content_encoded: string;
    media: {
        thumbnail: {
            url: string;
            medium: 'image';
        };
    };
}

interface ListRss<T = BusinessInsiderRssItem | GhostRssItem> {
    title: string//'Gospodarka businessinsider.com.pl',
    description: string//'Gospodarka businessinsider.com.pl',
    link: string//'https://businessinsider.com.pl/gospodarka',
    image: string//'https://ocdn.eu/businessinsider/static/bi-logo-horizontal.jpg.png',
    category: never[],
    items: T[],
}

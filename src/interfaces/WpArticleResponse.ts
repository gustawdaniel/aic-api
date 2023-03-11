export interface WpArticleResponse {
    id: number,
    date: string // '2023-03-11T15:48:32',
    date_gmt: string //'2023-03-11T14:48:32',
    guid: {
        rendered: string //'https://finews.pl/?p=151',
        raw: string //'https://finews.pl/?p=151'
    },
    modified: string //'2023-03-11T15:48:32',
    modified_gmt: string //'2023-03-11T14:48:32',
    password: string//'',
    slug: string//'',
    status: 'draft',
    type: string//'post',
    link: string//'https://finews.pl/?p=151',
    title: {
        raw: string//'My First Article',
        rendered: string//'My First Article'
    },
    content: {
        raw: string//'<p>This is the content of my first article.</p>',
        rendered: string//'<p>This is the content of my first article.</p>\n',
        protected: boolean//false,
        block_version: number//0
    },
    excerpt: {
        raw: string//'',
        rendered: string//'<p>This is the content of my first article.</p>\n',
        protected: boolean//false
    },
    author: number//1,
    featured_media: number//0,
    comment_status: string//'open',
    ping_status: string//'open',
    sticky: boolean//false,
    template: string//'',
    format: string//'standard',
    meta: [],
    categories: number[],
    tags: [],
    permalink_template: string//'https://finews.pl/index.php/2023/03/11/%postname%/',
    generated_slug: string//'my-first-article',
    _links: {
        self: [{
            href: string//'https://finews.pl/index.php/wp-json/wp/v2/posts/151'

        }],
        collection: [{
            href: string//'https://finews.pl/index.php/wp-json/wp/v2/posts'

        }],
        about: [
            {
                href: string//'https://finews.pl/index.php/wp-json/wp/v2/types/post'
            }
        ],
        author: [
            {
                embeddable: boolean//true,
                href: string//'https://finews.pl/index.php/wp-json/wp/v2/users/1'
            }
        ],
        replies: [
            {
                embeddable: boolean//true,
                href: string//'https://finews.pl/index.php/wp-json/wp/v2/comments?post=151'
            }
        ],
        'version-history': [
            {
                count: number//0,
                href: string//'https://finews.pl/index.php/wp-json/wp/v2/posts/151/revisions'
            }
        ],
        'wp:attachment': [
            {
                href: string//'https://finews.pl/index.php/wp-json/wp/v2/media?parent=151'
            }
        ],
        'wp:term': [
            {
                taxonomy: string//'category',
                embeddable: boolean//true,
                href: string//'https://finews.pl/index.php/wp-json/wp/v2/categories?post=151'
            },
            {
                taxonomy: string//'post_tag',
                embeddable: boolean//true,
                href: string//'https://finews.pl/index.php/wp-json/wp/v2/tags?post=151'
            }
        ],
        'wp:action-publish': [{
            href: string//'https://finews.pl/index.php/wp-json/wp/v2/posts/151'
        }],
        'wp:action-unfiltered-html': [{
            href: string//'https://finews.pl/index.php/wp-json/wp/v2/posts/151'
        }],
        'wp:action-sticky': [{
            href: string//'https://finews.pl/index.php/wp-json/wp/v2/posts/151'
        }],
        'wp:action-assign-author': [{
            href: string//'https://finews.pl/index.php/wp-json/wp/v2/posts/151'
        }],
        'wp:action-create-categories': [{
            href: string//'https://finews.pl/index.php/wp-json/wp/v2/posts/151'
        }],
        'wp:action-assign-categories': [{
            href: string//'https://finews.pl/index.php/wp-json/wp/v2/posts/151'
        }],
        'wp:action-create-tags': [{
            href: string//'https://finews.pl/index.php/wp-json/wp/v2/posts/151'
        }],
        'wp:action-assign-tags': [{
            href: string//'https://finews.pl/index.php/wp-json/wp/v2/posts/151'
        }],
        curies: [
            {
                name: string//'wp',
                href: string//'https://api.w.org/{rel}',
                templated: boolean//true
            }
        ]
    }
}

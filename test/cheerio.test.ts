import * as cheerio from 'cheerio';

describe('cheerio', () => {
    it('gets pre strict content', () => {
        expect(cheerio.load(`<pre><code class="language-rust">use linear_sort_reverse_search_rust_easy::reverse_search;
use std::io;

fn main() -&gt; io::Result&lt;()&gt; {
    reverse_search(&amp;mut io::stdin(), &amp;mut io::stdout())
}</code></pre>`).text().trim()).toEqual(`use linear_sort_reverse_search_rust_easy::reverse_search;
use std::io;

fn main() -> io::Result<()> {
    reverse_search(&mut io::stdin(), &mut io::stdout())
}`);
    })
})

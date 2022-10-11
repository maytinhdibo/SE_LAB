const cheerio = require('cheerio');

const request = require('request-promise');

const crawlURL = 'https://jprp.vn/index.php/JPRP/issue/archive';

function normalize(s) {

}

request(crawlURL, (error, response, body) => {
    const $ = cheerio.load(body);

    let numbering = 0;

    console.log($);

    /**$('.media-body a').each(async (index, el) => {
        let articleInfo = {};

        const innerLink = (await (async () => $(el).attr('href'))());

        await request(innerLink, async (error, response, html) => {
            const $2 = cheerio.load(html);

            $2('.article-summary.media').each(async (index, el) => {
                ++numbering;
                articleInfo.numbering = numbering;

                const articleSummary = $2(el).find('.col-md-10');
                let getName = async () => {
                    return articleSummary.find('a').text().trim();
                };
                articleInfo.name = (await getName());

                let getAuthors = async () => articleSummary.find('.authors').text().trim();
                articleInfo.authors = (await getAuthors());

                const innerLink = (await (async () => articleSummary.find('a').attr('href'))());

                await request(innerLink, async (error, response, html) => {
                    const $3 = cheerio.load(html);
                    let getReleaseDate = async () => $3('.list-group-item.date-published').text().trim().replace(/\n/g, '').replace(/\t/g, '').split(':')[1];
                    articleInfo.releaseDate = (await getReleaseDate());

                    articleInfo.index = (await (async () => $3(".issue .panel-body a").text().trim())());
                    ///console.log(articleInfo.releaseDate);
                    ///console.log(articleInfo.index);
                });

                ///if (numbering == 2)
                ///return false;
            });
        });
        await (async () => console.log(articleInfo))();
        ///if (numbering == 2)
        ///return false;
    })*/
})
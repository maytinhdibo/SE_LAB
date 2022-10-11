const cheerio = require('cheerio'); // module cheerio

const request = require('request-promise'); // module request-promise

const fs = require('fs'); // module filesystem

let totalArticles = 0;
let data = [];

const sourceLink = 'https://jprp.vn/index.php/JPRP/issue/archive';

async function getLinks(targetLink, [containerSelector, anchorSelector]) {
    const links = [];

    await request(targetLink)
        .then(function (html) {

            const $ = cheerio.load(html) // load HTMl

            $(containerSelector).each((index, el) => {
                const link = $(el).find(anchorSelector).prop('href').trim();
                links.push(link);
            })
        })
        .catch(function (err) {
            alert.log(err);
        });

    return links;
}

async function getDetailsInfo(articleLink) {
    const detailsInfo = {};

    await request(articleLink)
        .then(function (html) {

            const $ = cheerio.load(html) // load HTMl

            // Lấy ra thông tin
            let name;
            let author;
            let publishDate;
            let collectionName;

            $('.article-details header').each((index, el) => {
                name = $(el).find('h2').text().trim();
                author = $(el).find('#authorString i').text().trim();
            })
            publishDate = $('.list-group-item.date-published')
                .contents().filter(function () { // Lấy ra Text node
                    return this.nodeType == 3;
                })
                .text().trim();
            collectionName = $('.panel.panel-default.issue .panel-body a').text().trim();

            totalArticles++;

            Object.assign(detailsInfo, {
                id: totalArticles,
                name,
                author,
                publishDate,
                collectionName,
            });

            data.push(detailsInfo);

        })
        .catch(function (err) {
            alert.log(err);
        });

    return detailsInfo;
}

async function crawl() {
    console.time('Crawl time');

    const collectionLinks = await getLinks(sourceLink, ['.issue-summary', '.issue-summary .media-body .title']);
    console.log(collectionLinks);
    for (const collectionLink of collectionLinks) {
        const articleLinks = await getLinks(collectionLink, ['.article-summary.media', '.article-summary.media .media-body a']);
        console.log(articleLinks);
        for (const articleLink of articleLinks) {
            const detailsInfo = await getDetailsInfo(articleLink);
            console.log(detailsInfo);
        }
    }

    fs.writeFileSync('data.json', JSON.stringify(data), 'utf-8');

    console.log("Total articles: " + totalArticles);
    console.timeEnd('Crawl time');
}

crawl();
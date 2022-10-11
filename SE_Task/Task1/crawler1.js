const cheerio = require('cheerio')

const request = require('request-promise')

request('https://jprp.vn/index.php/JPRP/issue/archive', (error, response, html) => {
    if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html); // load HTML

        let numbering = 0;

        $('.media-body a').each((index, el) => {
            const innerLink = $(el).attr('href');
            request(innerLink, (error, response, html) => {
                const $2 = cheerio.load(html);

                $2('.article-summary.media').each(async (index, el) => {
                    ++numbering;
                    console.log("Số thứ tự: " + numbering);
                    const articleSummary = $2(el).find('.col-md-10');
                    console.log("Tên bài báo: " + articleSummary.find('a').text().trim())
                    console.log("Tên tác giả: " + articleSummary.find('.authors').text().trim())
                    const innerLink = articleSummary.find('a').attr('href');
                    let g = await request(innerLink, (error, response, html) => {
                        const $3 = cheerio.load(html)
                        let releaseDate = $3('.list-group-item.date-published').text().trim().replace(/\n/g, '').replace(/\t/g, '').split(':')[1];
                        console.log("Ngày đăng: " + releaseDate)
                        console.log("Số tạp chí: " + $3(".issue .panel-body a").text().trim())
                    })

                    ///if (numbering == 2)
                    return false;
                })
            })
            ///if (numbering == 2)
            return false;
        })

    }
    else {
        console.log(error);
    }
});

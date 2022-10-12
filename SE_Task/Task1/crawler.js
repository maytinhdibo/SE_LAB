const cheerio = require('cheerio');

const axios = require('axios');

const excel = require('exceljs');

const fs = require('fs');

const crawlURL = 'https://jprp.vn/index.php/JPRP/issue/archive';

let workbook;
let sheets;

let g;
let arr = [];

async function initExcel() {
    ///console.log(1);
    workbook = new excel.Workbook();
    sheets = workbook.addWorksheet("Data");
    sheets.columns = [
        { header: "Số thứ tự", key: "numbering" },
        { header: "Tên báo", key: "title", width: 60 },
        { header: "Tác giả", key: "authors" },
        { header: "Ngày xuất bản", key: "releaseDate" },
        { header: "Tên số báo", key: "collection" },
    ];
    return;
}

async function addData(data) {
    ///console.log(data);
    await sheets.addRow(data);
}

async function fetchData(crawlURL) {
    let response = await axios(crawlURL).catch((err) => console.log(crawlURL));

    if (response?.status != 200) {
        console.log("Error occurred while fetching data from " + crawlURL);
        return;
    }
    return response.data;
}

async function getArticlesInfo() {
    const $ = cheerio.load(await fetchData(crawlURL));
    let numbering = 0;

    for(el of $('.issue-summary .media-body a')){
        const articleSummaryLinks = $(el).attr('href');

        const $2 = cheerio.load(await fetchData(articleSummaryLinks));

        $2('.article-summary.media').each(async (index, el) => {
            ///++numbering;
            const articleLink = $2(el).find('.col-md-10').find('a').attr('href');

            const $3 = cheerio.load(await fetchData(articleLink));
            const arrticleInfoQuery = $3('.article-details');
            const info = await Promise.all([
                (async () => arrticleInfoQuery.find('header h2').text().trim())(),
                (async () => arrticleInfoQuery.find('#authorString').text().trim())(),
                (async () => arrticleInfoQuery.find('.list-group-item.date-published').text().trim().replace(/\n/g, '').replace(/\t/g, '').split(':')[1])(),
                (async () => arrticleInfoQuery.find('.issue .panel-body a').text().trim())()]);

            ///console.log(info);
            let articleInfo = {
                'numbering': ++numbering,
                'title': info[0],
                'authors': info[1],
                'releaseDate': info[2],
                'collection': info[3],
            };
            await addData(articleInfo);
            ///arr.push(articleInfo);
            ///console.log(articleInfo);
        });
    }
    ///console.log('get ' + new Date().getTime());
    ///console.log(g);
}

async function main() {
    await initExcel();
    ///setTimeout(async () => { await getArticlesInfo(); }, 0);
    await getArticlesInfo();
    console.log("done");
    await workbook.xlsx.writeFile("Articles Infomation.xlsx");
    ///fs.writeFileSync('info.json', JSON.stringify(arr));
    ///setTimeout(() => workbook.xlsx.writeFile("Articles Infomation.xlsx"), 0);

    ///console.log('print ' + new Date().getTime());
    ///await workbook.xlsx.writeFileSync("Articles Infomation.xlsx");
    ///addData({ numbering: 1 });
    ///print();
}

main();

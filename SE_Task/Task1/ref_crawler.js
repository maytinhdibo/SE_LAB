const rp = require("request-promise");
const cheerio = require('cheerio');
const fs = require('fs');
const { AsyncLocalStorage } = require("async_hooks");

const URL = `https://jprp.vn/index.php/JPRP/issue/archive?fbclid=IwAR0wsHq3drGMoG8JsakKwAcvChfEvgNLUAKrN9YzN3-fxzXEk4_43JN0hYU`;

var arr = [];

let numbering = 0;

async function getHref(link, htmlSelector) {
    try {
        // Lấy dữ liệu từ trang crawl đã được parseDOM
        var $ = await rp(link);
    } catch (error) {
        return error;
    }
    var ds = $(htmlSelector);
    var list = [];
    ds.each(function (i, e) {
        list.push({
            url: e["attribs"]["href"],
            transform: function (body) {
                return cheerio.load(body);
            }
        })
    });
    return list;

};

async function handle(link) {
    var articleList = await getHref(link, "div.media-list div.article-summary div.media-body div.row div.col-md-10 a");
    for (article of articleList) {
        getContentArticle(article);
    }

}

async function getContentArticle(link) {
    try {
        var $ = await rp(link);
    } catch (error) {
        console.log(error);
        return error;
    }
    var articleName = $("article.article-details header h2").text().trim();
    var author = $("#authorString > i").text().trim();
    var date = $("body > div.pkp_structure_page > div.pkp_structure_content.container > main > div > article > div > section > div.list-group > div.list-group-item.date-published").text().trim();
    var dateString = date.split('\t');
    date = dateString[dateString.length - 1];
    var numberArticleName = $("div.list-group div.issue div.panel-body a.title").text().trim();
    var newObj = {
        'numbering': ++numbering,
        'articleName': articleName,
        'author': author,
        'date': date,
        'numberArticleName': numberArticleName
    }
    console.log(newObj);
    arr.push(newObj);
    fs.writeFileSync('data.JSON', JSON.stringify(arr));
}

async function crawler() {
    var optionList = await getHref({
        url: URL,
        transform: function (body) {
            return cheerio.load(body);
        }
    }, "div.issue-summary div.media-body a.title");

    for (var i = 0; i < optionList.length;) {
        handle(optionList[i++]);
    }
}

crawler();
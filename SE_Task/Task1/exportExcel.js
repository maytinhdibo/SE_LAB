const excel = require('exceljs');

const workbook = new excel.Workbook();

const sheet = workbook.addWorksheet("data");

sheet.columns = [{ header: "f", key: "f", width: 30 },];

let g = { g: "GG", t: "hehe" };

sheet.addRow(g);

workbook.xlsx.writeFile("hehe.xlsx");
import ExcelJS from 'exceljs';

/**
 * @desc Generate and stream Excel file
 * @param {Object} res - Express response object
 * @param {String} fileName - Name of the file (without extension)
 * @param {Array} columns - Array of column definitions { header, key, width }
 * @param {Array} data - Array of data objects
 */
async function generateExcel(res, fileName, columns, data) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Report');

  worksheet.columns = columns;
  worksheet.addRows(data);

  // Style header row
  worksheet.getRow(1).font = { bold: true };

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename=${fileName}.xlsx`);

  await workbook.xlsx.write(res);
  res.end();
}

export { generateExcel };

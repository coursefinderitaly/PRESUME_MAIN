const xlsx = require('xlsx');
const path = require('path');

const filePath = '/media/raag/New Volume/parrot/Desktop/presume/next-backend/courses.xlsx';
try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
    
    console.log("Headers:", sheetData[0]);
    console.log("First Data Row:", sheetData[1]);
} catch (error) {
    console.error("Error reading excel:", error.message);
}

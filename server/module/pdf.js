const express = require('express');
const route = express.Router();
const mail = require('../config/mail');
const path = require("path");
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const { UserLoggin, AvoidIndex, AdminRoleBased } = require('../auth/auth');
const random = Math.floor(Math.random() * 99999);
const rando = Math.floor(Math.random() * 99999);
const rand = rando + "SUN" + random;
const bodyParser = require('body-parser');
const { PDFDocument, rgb } = require('pdf-lib'); 
const fs = require('fs');
const path = require('path');

// Set up EJS for templating
route.set('view engine', 'ejs');
route.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (like the generated PDFs)
route.use(express.static('public'));

 
// Route to generate dynamic PDF based on input
route.post('/generate-receipt', async (req, res) => {
    const { customerName, amount, receiptNumber } = req.body;

    // Path to the static template
    const templatePath = path.join(__dirname, 'public', 'templates', 'receipt_template.pdf');
    
    // Load the template PDF
    const templateBytes = fs.readFileSync(templatePath);
    const pdfDoc = await PDFDocument.load(templateBytes);

    // Embed a font (optional, for dynamic text)
    const helveticaFont = await pdfDoc.embedFont(PDFDocument.Helvetica);

    // Get the first page of the PDF to modify
    const page = pdfDoc.getPages()[0];
    const { width, height } = page.getSize();

    // Add dynamic content (customer name, amount, etc.)
    page.drawText(`Customer Name: ${customerName}`, {
        x: 50, 
        y: height - 150, 
        size: 15, 
        font: helveticaFont,
        color: rgb(0, 0, 0),
    });

    page.drawText(`Amount Paid: $${amount}`, {
        x: 50,
        y: height - 200,
        size: 15,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    });

    page.drawText(`Receipt Number: ${receiptNumber}`, {
        x: 50,
        y: height - 250,
        size: 15,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    });

    page.drawText(`Date: ${new Date().toLocaleDateString()}`, {
        x: 50,
        y: height - 300,
        size: 15,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    });

    // Save the modified PDF to a new file
    const modifiedPdfBytes = await pdfDoc.save();
    const outputFilePath = path.join(__dirname, 'public', `receipt_${receiptNumber}.pdf`);
    fs.writeFileSync(outputFilePath, modifiedPdfBytes);

    // Send the download link
    res.render('receipt', { filePath: `/receipt_${receiptNumber}.pdf` });
});

// Start the server



module.exports = route;
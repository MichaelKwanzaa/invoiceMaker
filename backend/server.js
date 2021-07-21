const express = require('express');
const app = express();
const cors = require('cors');
const PDFDocument = require('pdfkit')
const fs = require('fs')
const port = 8000;

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json()) 

//Post - gets data from frontend

app.post("/create-pdf", (req, res) => {
    let obj = req.body;
    let pdfDoc = new PDFDocument;
    /* PDF GENERATOR */
    pdfDoc.pipe(fs.createWriteStream("invoice.pdf"));
    /* Header */
    pdfDoc 
        .fontSize(10)
        .text(obj.fromBusinessName, 70, 55)
        .text(`${obj.fromStreetAddress}, ${obj.fromZipCode}`, 70, 75)
        .text(obj.fromBusinessAddress, 70, 95)
        .text(obj.fromTelephoneNumber, 70, 115)
        .fontSize(10)
        .text(obj.toBusinessName, 200, 55, { align: "right" })
        .text(obj.toBusinessAddress, 200, 75, { align: "right" })
        .text(obj.toTelephoneNumber, 200, 95, { align: "right"})
        .text(`Invoice sent: ${obj.dateOfInvoice}`, 200, 115, { align: "right"})
        .text(`Invoice due: ${obj.dateOfInvoiceDue}`, 200, 135, { align: "right"})
        .text("Description", 50, 220)
        .text("Rate", 190, 220)
        .text("Quantity", 280, 220, { width: 90, align: "right" })
        .text("Amount in $", 370, 220, { width: 90, align: "right" })
        .text("Tax", 0, 220, { align: "right"})
        generateHr(pdfDoc, 235)
        generateInvoiceTable(pdfDoc, obj.itemValues, obj)
        
    pdfDoc.end();

    

 })

 function generateHr(doc, y) {
    doc
      .strokeColor("#aaaaaa")
      .lineWidth(1)
      .moveTo(50, y)
      .lineTo(550, y)
      .stroke();
  }

const generateTableRow = (pdf, position, description, rate, quantity, amount, tax) => {
    pdf
    .fontSize(10)
    .text(description, 50, position)
    .text(rate, 190, position)
    .text(quantity, 280, position, { width: 90, align: "right" })
    .text(`$${parseFloat(amount).toFixed(2)}`, 370, position, { width: 90, align: "right" })
    .text(tax, 0, position, { align: "right" });
}

const generateInvoiceTable = (pdf, items, data) => {
    let i, itemTop = 250;
    let position = 0;
    for(i = 0; i < items.length; i++){
        const item = items[i];
        position = itemTop + (i + 1) * 30;
        generateHr(pdf, position - 10);
        generateTableRow(pdf, position, item.description, item.rate, item.quantity, item.amount, item.tax)
    }    
    pdf
    .text("", {width: "80%", background: "black", height: "2px"})
    .text("Subtotal: ", 370, position + 30, {width: 90, align: "right"})
    .text(`$${parseFloat(data.subTotal).toFixed(2)}`, 0, position + 30, { align: "right"})
    .text("Tax: ", 370, position + 45,  {width: 90, align: "right"})
    .text(`$${parseFloat(data.tax).toFixed(2)}`, 0, position + 45,  { align: "right"})
    .text("Total: ", 370, position + 60,  {width: 90, align: "right"})
    .text(`$${parseFloat(data.total).toFixed(2)}`, 0, position + 60,  { align: "right"})
    .text("Comments: ", 280, position + 90, {width: 90, alight: "right"})
    .text(data.additionalNotes, 280, position + 105, {width: 90, align: "right"})
}

//get - sends the pdf to the frontend
app.get('/pdf', (req, res) => {
    res.sendFile(`${__dirname}/invoice.pdf`);
})

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`)
})


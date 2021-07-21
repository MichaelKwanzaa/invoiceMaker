import React from 'react'

const Date = ({title, defaultDate, defaultDateDue, onChange}) => {
    return (
        <div className="invoice-side date-invoice">
        <h1>{title}</h1>
        <label for="date">Date of Invoice</label >
        <input class="date-of-invoice" 
        id="date-of-invoice" 
        type="date" 
        name="dateOfInvoice"
        defaultValue={defaultDate}
        onChange={onChange}
        />
        <br />
        <label  for="date-due">Date of Invoice Due</label >
        <input class="date-of-invoice-due"
        id="date-of-invoice-due"
        type="date"
        name="dateOfInvoiceDue"
        defaultValue={defaultDateDue}
        onChange={onChange}
        />
    </div>
    )
}

export default Date

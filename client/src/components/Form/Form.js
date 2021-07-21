import React, { Component } from 'react'
import axios from 'axios';
import './Form.css'
import FromBusiness from './FromBusiness/FromBusiness';
import ToBusiness from './ToBusiness/ToBusiness'

const taxOptions = [
    {label: "None", value: "None"},
    {label: "Per Item", value: "Per Item"}
];
class Form extends Component {
    constructor(props){
        super(props);
        var date = new Date();
        //Google chrome formatted date
        var formattedDate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
        this.state = {
                fromBusinessName : "",
                fromBusinessAddress : "",
                fromStreetAddress : "",
                fromZipCode : "",
                fromTelephoneNumber : "",
                toBusinessName : "",
                toBusinessAddress : "",
                toTelephoneNumber : "",
            dateOfInvoice : formattedDate,
            dateOfInvoiceDue : formattedDate,
            itemValues: [{ 
                description:  "",
                rate: 1,
                quantity: 0,
                amount: 0,
                tax: 0
            }],
            taxation: "None",
            subTotal: 0,
            tax: 0,
            total: 0,
            additionalNotes: ""
        }

        this.taxHandleChange = this.taxHandleChange.bind(this);
        this.additionalNotesHandleChange = this.additionalNotesHandleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

//sets the date to clicked item in GoogleChrome date format
    fromToDateChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    addItem = (e) => {
        e.preventDefault();
        this.setState((prevState) => ({
        //eqv to this.setState({itemValue : [...prevState.itemValues (old), itemValues (now)]})
            itemValues : [...prevState.itemValues, {
                description:  "",
                rate: 1,
                quantity: 0,
                amount: 0,
                tax: 0
            }]
        }));
    }
      
    removeClick = (index) =>{
        let items = [...this.state.itemValues];
        items.splice(index, 1);
        this.setState(items);
    }

    handleChange = (location, property) => (e) => {
        this.setState((prevState) => ({
            //similar to add item
          ...prevState,
          itemValues: [...prevState.itemValues.slice(0, location),
            {
              ...prevState.itemValues[location],
              [property]: e.target.value,
            }
          ]
        }))
    }

    handleDate = (e) => {
        //sets date to google chrome required date
        this.setState({
            [e.target.name] : (e.target.value).toLocaleString()
        })
    }

    removeClick = (index) => {
        let array = this.state.itemValues;
        if(index !== 0){
            array.splice(index, 1);
            this.setState({itemValues : array});
        }
    }

    saveFromBusiness = (e) => {
        this.setState({input: e.target.value});
    };

    additionalNotesHandleChange = (e) => {
        this.setState({additionalNotes: e.target.value});
    }

    taxHandleChange(e){
        this.setState({taxation: e.target.value});
    }
    formChange = () => {
        let subTotals = [];
        let total = [];
        let array = [...this.state.itemValues];
        for(let i = 0; i < array.length; i++){
            let tempSum = 0;
            let tempSumWithoutTax = 0;
            let rate = Number(array[i].rate);
            let quantity = Number(array[i].quantity);
            let amount = Number(array[i].amount);
            let taxes = Number(array[i].tax) > 0 ? Number(array[i].tax) / 100 : " "; 
            tempSumWithoutTax = rate * quantity * amount;
            subTotals.push(tempSumWithoutTax);
            let taxSum = tempSumWithoutTax * taxes;
            tempSum = tempSumWithoutTax + taxSum;
            total.push(tempSum);  
        }
        let sub = subTotals.reduce((a, b) => a + b, 0);
        let tot = total.reduce((a, b) => a + b, 0);
        let taxs = tot - sub;
        
        this.setState({subTotal : sub });
        this.setState({tax : taxs});
        this.setState({total : tot});
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const apiURL = "http://localhost:8000";

        axios.post(`${apiURL}/create-pdf`, this.state)
        axios(`${apiURL}/pdf`, {
            method: 'GET',
            responseType: 'blob' //Force to receive data in a Blob Format
         })
         .then(response => {
         //Create a Blob from the PDF Stream
            const file = new Blob(
              [response.data], 
              {type: 'application/pdf'});
         //Build a URL from the file
            const fileURL = URL.createObjectURL(file);
         //Open the URL on new Window
            window.open(fileURL);
         })
         .catch(error => {
            console.log(error);
         });


    }

    render(){
        //destructs itemValues state for later usee
        let { itemValues } = this.state;

        return (
            <div className="invoice-form">
                <form className="invoice" onChange = {this.formChange} onSubmit={this.handleSubmit}>
                    <div className="invoice-top">
                    <FromBusiness title="From" onChange={this.fromToDateChange} />
                    <ToBusiness title="To" onChange={this.fromToDateChange} />
                    <div className="invoice-side date-invoice">
                        <h1>Date</h1>
                        <div className="inputDate">
                            <label for="date">Date of Invoice</label >
                            <input class="date-of-invoice" 
                            id="date-of-invoice" 
                            type="date" 
                            name="dateOfInvoice"
                            defaultValue={this.state.dateOfInvoice}
                            onChange={this.handleDate}
                            />
                        </div>
                        <div className="inputDate">
                        <label for="date-due">Date of Invoice Due</label >
                        <input class="date-of-invoice-due"
                        id="date-of-invoice-due"
                        type="date"
                        name="dateOfInvoiceDue"
                        defaultValue={this.state.dateOfInvoiceDue}
                        onChange={this.handleDate}
                        />
                        </div>
                        
                    </div>
                    </div>

                    <div className="invoice-middle">
                        <div className="invoice-items">
                            
                        <div className="item-titles">
                            <ul>
                            <li className={this.state.taxation === "None" ? "item-help one" : "item-help one-tax"}>Description</li>
                                <li className={this.state.taxation === "None" ? "item-help two" : "item-help two-tax"}>Rate</li>
                                <li className={this.state.taxation === "None" ? "item-help three" : "item-help three-tax"}>Quantity</li>
                                <li className={this.state.taxation === "None" ? "item-help four" : "item-help four-tax"}>Amount</li>
                                {this.state.taxation === "None" ? "" : <li className="item-help five">Tax</li>}
                            </ul>
                        </div>
                        
                        
                        <div className="items">
                        <hr className="item-border" />
                        {
                            itemValues.map((item, i) => {
                                let descId = `description-${i}`;
                                let rateId = `rate-${i}`;
                                let quanId = `quantity-${i}`;
                                let amonId = `amount-${i}`;
                                let taxId = `tax-${i}`;
                                return(
                                    <div key={i} className="item-row">
                                        <input 
                                        className="item item-description"
                                            type="text"
                                            id={descId}
                                            name={descId}
                                            placeholder="Item description"
                                            data-id={descId}
                                            onChange={this.handleChange(i, 'description')}
                                            
                                             />
                                            {/* */}

                                            <input className="item item-rate"
                                            type="number"
                                            id={rateId}
                                            name={rateId}
                                            placeholder="Item rate"
                                            data-id={rateId}
                                            value={itemValues[i].rate}
                                            onChange={this.handleChange(i, 'rate')}
                                            
                                             />
                                            {/* */}
                                            <input className="item item-quantity"
                                            id="item-quantity"
                                            type="number"
                                            placeholder="item quantity"
                                            data-id={quanId}
                                            value={itemValues[i].quantity}
                                            onChange={this.handleChange(i, 'quantity')}
                                            
                                             />
                                            {/* */}
                                            <input className="item item-amount"
                                            id="item-amount"
                                            type="number"
                                            placeholder="item amount"
                                            value={itemValues[i].amount}
                                            data-id={amonId}
                                            onChange={this.handleChange(i, 'amount')}
                                            
                                             />
                                            {/* */}
                                            
                                            {this.state.taxation === "None" ? "" : <input class="item item-tax"
                                            id="item-tax"
                                            type="number"
                                            placeholder="tax(%)"
                                            data-id={taxId}
                                            value={itemValues[i].tax}
                                            onChange={this.handleChange(i, 'tax')}
                                            
                                             />}

                                        <input type='button' value='Remove Item' className="remove-item" onClick={this.removeClick.bind(this, i)}
                                    />
                                    </div>
                                )
                            })
                        }
                    
                         </div>
                    </div>
                        <div className="tax-choices">
                        <h2>Tax Options</h2>
                        <select value = {this.state.taxation} onChange={this.taxHandleChange}>
                        {taxOptions.map(option => (
                            <option value={option.value}>{option.label}</option>
                        ))}
                            </select>
                        </div>  
                    </div>

                    <button onClick={this.addItem} className="add-item">Add more items</button>
                    <div className="invoice-bottom">
                        <div className="price">
                            <p className="sub-total">Subtotal: ${this.state.subTotal}</p>
                            <p className="tax-total">Tax: ${this.state.tax}</p>
                            <p className="price-total">Total: ${this.state.total}</p>
                            <textarea className="note-textarea"
                            id="note-textarea"
                            placeholder="Additional Notes..."
                            cols="35"
                            rows="3"
                            onChange={this.additionalNotesHandleChange}
                            required
                            />

                        </div>
                       
                    </div>
                    <div className="submit-form">
                        <input type="submit"
                        className="submit-button"
                        id="submit-button"
                        value="Generate"
                        />
                    </div> 
                    
                    </form>
            </div>
        );
    }
}

export default Form

    /*
From
Business Name 
Email Address
Street Address
Zip code
Phone Number
To
Business Name
Email Address
Phone Number

Invoice Number
Automatic ~ Date

Array of Description
Name, Rate, Amount = price

sub total
Tax 
options ~ Total, per Item inc, None, deducted Tax

SUM Price

Note

*/

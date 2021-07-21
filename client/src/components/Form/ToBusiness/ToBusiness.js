import React from 'react'
import '../Form.css'

const ToBusiness = ({title, onChange}) => {
    return (
            <div className="invoice-side to">
                        <h1>{title}</h1>
                                    <input class="to-invoice business-name" 
                                    id="from-business-name"
                                    type="text"
                                    placeholder="Enter business name..." 
                                    name="toBusinessName"
                                    onChange={onChange}
                                    autofocus />

                                    <input class="to-invoice email-address"
                                    id="from-email-address"
                                    type="email"
                                    placeholder="Enter email address..."
                                    name="toBusinessAddress"
                                    onChange={onChange}
                                    autofocus />

                                    <input class="to-invoice telephone-number"
                                    id="from-telephone-number"
                                    type="tel"
                                    placeholder="Enter telephone number..."
                                    name="toTelephoneNumber"
                                    onChange={onChange}
                                    autofocus />
                                    
                        </div>
    )
}

export default ToBusiness

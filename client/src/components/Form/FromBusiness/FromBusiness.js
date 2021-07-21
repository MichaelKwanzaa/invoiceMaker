import React from 'react'

const FromBusiness = ({title, onChange}) => {
    return (
        <div className="invoice-side from">
                        <h1>{title}</h1>
                                <input className="from-invoice business-name" 
                                id="from-business-name"
                                type="text"
                                name="fromBusinessName"
                                placeholder="Enter business name..." 
                                onChange={onChange}
                                autofocus />

                                <input className="from-invoice email-address"
                                id="from-email-address"
                                type="email"
                                placeholder="Enter email address..."
                                name="fromBusinessAddress"
                                onChange={onChange}
                                autofocus />

                                <input className="from-invoice street-address"
                                id="from-street-address"
                                type="text"
                                placeholder="Enter street address..."
                                name="fromStreetAddress"
                                onChange={onChange}
                                autofocus />

                                <input className="from-invoice zip-code"
                                id="from-zip-code"
                                type="text"
                                placeholder="Enter zipcode..."
                                name="fromZipCode"
                                onChange={onChange}
                                autofocus />

                                <input className="from-invoice telephone-number"
                                id="from-telephone-number"
                                type="tel"
                                placeholder="Enter telephone number..."
                                name="fromTelephoneNumber"
                                onChange={onChange}
                                autofocus />
                        </div>
    )
}

export default FromBusiness

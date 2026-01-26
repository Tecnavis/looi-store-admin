import React from 'react';
import './checkoutheader.css'; // Create a separate CSS file for styling

const CheckoutHeader = ({ currentStep }) => {
  return (
    <div className="checkout-header">
      <div className={`step ${currentStep === 'bag' ? 'active' : ''}`}>
        MY BAG
      </div>
      <div className="dashed-line">------------------</div>
      <div className={`step ${currentStep === 'address' ? 'active' : ''}`}>
        ADDRESS
      </div>
      <div className="dashed-line">------------------</div>
      <div className={`step ${currentStep === 'payment' ? 'active' : ''}`}>
        PAYMENT
      </div>
    </div>
  );
};

export default CheckoutHeader;

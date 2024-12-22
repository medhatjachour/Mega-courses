"use client";

import Loading from '@/components/Loading'
import WizardStepper from '@/components/WizardStepper'
import { useUser } from '@clerk/nextjs'
import React from 'react'
import { useCheckoutNavigation } from '@/hooks/useCheckoutNavigation';
import CheckoutDetailsPage from './details';
import PaymentPage from './payment';
import CompletionPage from './completion';

const CheckoutWizard = () => {
  
    const {isLoaded} = useUser()

    const {checkOutStep} = useCheckoutNavigation()

  if (!isLoaded) return <Loading/>
const renderStep = () => {
    switch  (checkOutStep){
        case 1:
            return <CheckoutDetailsPage/>;
        case 2:
            return <PaymentPage/>;
        case 3:
            return <CompletionPage/>;
        default  :
            return <CheckoutDetailsPage/>;
        
        }
}

     return (
    <div className='checkout'>
        <WizardStepper currentStep={checkOutStep}/>
        <div className='checkout__content'>
            {renderStep()}
        </div>
    </div>
  )
}

export default CheckoutWizard
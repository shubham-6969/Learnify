import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";


const stripePromise = loadStripe("pk_test_51R5oqiAOliERgcsVnGYHA9M3DLBAxjUYKnGEfYF6KBRDpNb7B0I4U6ah8l1cD6FglejV8NRjoUKBAaLFVhFwrqm0000NUfVRZu");



createRoot(document.getElementById('root')).render(
  

<Elements stripe={stripePromise}>
   <BrowserRouter>
      <App />
   </BrowserRouter>
</Elements>
  
)

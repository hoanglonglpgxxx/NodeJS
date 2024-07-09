/*eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

// Function to check if Stripe is available and then execute the Stripe function
const initializeStripe = (stripePublicKey) => {
    if (typeof Stripe === 'undefined') {
        return null;
    }
    return Stripe(stripePublicKey);
};
const stripe = initializeStripe('pk_test_51PZ1LcCIAEQH1pNppKu6pdTp8dZucFFhnCroB4vqNcAB6Pw2sdnwWdKzdJHy4QDSnKWb3x9PHzsx9ZCfwCWvy9eD00TKQYy8Rg');

export const bookingTour = async tourId => {

    try {
        // 1) Get the session from the server
        const session = await axios(
            `/api/v1/bookings/checkout-session/${tourId}`
        );

        // 2) Create check out form + charge credit card
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        });
    } catch (err) {
        console.log(err);
        showAlert('error', err);
    }

};
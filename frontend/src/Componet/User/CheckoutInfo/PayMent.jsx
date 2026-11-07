import React, { useEffect, useState } from 'react'
import { PaystackButton } from 'react-paystack';
import { useDispatch, useSelector } from 'react-redux';
import commaNumber from 'comma-number';
import axios from 'axios';
import baseUrl from '../../../BaseUrl';
import {
  setDeliveryFee,
  setAmount,
  setTotalFee,
  setPhoneNo
} from '../../../Redux/DeliveryInfo.slice'
import { Link, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import PaymentValidation from "./PaymentValidation"

const PayMent = () => {
  const publicKey = 'pk_test_fb8e6ca8bf86aecccd78ba8772768e112d45e32a';
  const user = useSelector((state) => state.user.user);
  const cart = useSelector((state) => state.cart.cart);
  const deliveryInfo = useSelector((state) => state.delivery);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();


  const calculateTotalPrice = () => {
    let totalPrice = 0;
    cart.forEach(item => {
      totalPrice += item.price * item.quantity;
    });
    return totalPrice;
  };

  const deliveryFee = () => cart.length * 800;
  const totalFee = () => deliveryFee() + calculateTotalPrice();

  useEffect(() => {
    if (user) {
      dispatch(setDeliveryFee({ deliveryFee: deliveryFee() }));
      dispatch(setAmount({ amount: calculateTotalPrice() }));
      dispatch(setTotalFee({ totalFee: totalFee() }));
    }
  }, [user, dispatch]);

  const handlePaymentSuccess = (response) => {
    if (cart.length === 0) {
      enqueueSnackbar('You currently have no orders to pay for.', { variant: 'warning' })
      return ;
    }

    // Only the payment reference and delivery details are sent. The server works out the items,
    // prices and totals itself and confirms the payment with Paystack before creating the order.
    const postData = {
      reference: response.reference,
      latitude: deliveryInfo.latitude,
      longitude: deliveryInfo.longitude,
      state: deliveryInfo.state,
      city: deliveryInfo.city,
      address: deliveryInfo.address,
      phoneNo: deliveryInfo.phoneNo,
      deliveryType: deliveryInfo.deliveryType,
    };
    (async () => {
      try {
        const res = await axios.post(baseUrl + `/makingPayment`, postData);
        if (res.status == 200) {
          enqueueSnackbar('Payment successful! Your order is in review.', { variant: 'success' });
          setTimeout(() => {
            navigate('/user/menu');
          }, 2000);
        }
      } catch (error) {
        // The server explains what went wrong (for example how to reach support with the payment reference).
        const message = error.response?.data?.message || 'Payment failed. Please try again.';
        enqueueSnackbar(message, { variant: 'error', autoHideDuration: 12000 });
      }
    })();
  };

  const handlePaymentClose = () => enqueueSnackbar('Payment modal closed', { variant: 'info' });

  return (
    <div>
      <div className="h-fit w-full bg-white rounded shadow pb-2">
        <div className="text w-full p-3 text-[0.9rem] font-medium ">
          Order summary
        </div>
        <hr />
        <div className="text px-3 py-1 ">
          <div className="text flex justify-between items-center">
            <p className='font-medium text-sm'>Item&lsquo;s total ({cart.length})</p>
            <p className='text-right font-medium t003ext-xl'>₦ {commaNumber(calculateTotalPrice())}</p>
          </div>
          <div className="text flex justify-between items-center my-3">
            <p className='font-medium text-sm'>Delivery fees</p>
            <p className='text-right font-medium t003ext-xl'>₦ {commaNumber(deliveryFee())}</p>
          </div>
          <div className="text flex justify-between items-center">
            <p className='font-medium'>Total</p>
            <p className='text-right font-medium text-xl'>₦ {commaNumber(totalFee())}</p>
          </div>
          <hr className='my-2' />
          <PaystackButton
            text="Make Payment"
            className="bg-red-600 hover:bg-red-700 w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            publicKey={publicKey}
            email={user.email}
            amount={totalFee() * 100}
            onSuccess={handlePaymentSuccess}
            onClose={handlePaymentClose}
            reference={deliveryInfo.reference}
            description={deliveryInfo.description}
            currency="NGN"
            channels={['card', 'bank_transfer']}
            currencyFormat="NGN"
            disabled={false}
            embed={true}
            textStyle={{ fontWeight: 'bold' }}
            metadata={{
              custom_fields: cart.map(item => ({
                display_name: "Product Name",
                variable_name: "product_name",
                value: `${item.name} - ₦${item.price} (${item.quantity})`
              }))
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default PayMent
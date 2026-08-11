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

    console.log('Payment successful', response);
    const postData = {
      message: response.message,
      reference: response.reference,
      PaymentStatus: response.status,
      transaction: response.transaction,
      latitude: deliveryInfo.latitude,
      longitude: deliveryInfo.longitude,
      state: deliveryInfo.state,
      city: deliveryFee.city,
      address: deliveryInfo.address,
      phoneNo: deliveryInfo.phoneNo,
      amount: deliveryInfo.amount,
      deliveryFee: deliveryInfo.deliveryFee,
      totalFee: deliveryInfo.totalFee,
      deliveryType: deliveryInfo.deliveryType,
      cart: cart,
      user: user,
      status: 'Paid',
    };
    (async () => {
      try {
        const res = await axios.post(baseUrl + `/makingPayment`, postData);
        console.log(res);
        if (res.status == 200) {
          enqueueSnackbar('Payment successful! Your order is in review.', { variant: 'success' });
          setTimeout(() => {
            navigate('/user/menu');
          }, 2000);
        }
      } catch (error) {
        console.error(error);
        enqueueSnackbar('Payment failed. Please try again.', { variant: 'error' });
      }
    })();
  };

  const handlePaymentClose = () => enqueueSnackbar('Payment modal closed', { variant: 'info' });

  return (
    <div>
      <h1>Payment system coming soon</h1>
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
            amount={deliveryInfo.amount * 100}
            onSuccess={handlePaymentSuccess}
            onClose={handlePaymentClose}
            reference={deliveryInfo.reference}
            description={deliveryInfo.description}
            currency="NGN"
            channels={['card', 'bank_transfer']}
            currencyFormat="NGN"
            disabled={false}
            customButton={<button>Custom Pay Button</button>}
            embed={true}
            textStyle={{ fontWeight: 'bold' }}
            beforeInitialize={() => console.log('Initializing payment...')}
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
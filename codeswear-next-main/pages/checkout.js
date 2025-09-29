import Head from "next/head";
import React, { useContext, useEffect, useState } from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import userContext from "../context/user/userContext";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import axios from "axios";

const Checkout = ({ cart, addToCart, removeFromCart, subTotal, clearCart }) => {
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    phone: "",
    zipcode: "",
    address: "",
    city: "Lahore",
    state: "Punjab",
  });

  const UserContext = useContext(userContext);
  const { user } = UserContext;
  const router = useRouter();

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, phone, zipcode, address } = formValues;
    if (!name || !email || !phone || !zipcode || !address) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const orderId = "ORDER_" + new Date().getTime();

      const response = await axios.post("/api/paytm/initiateTransaction", {
        amount: subTotal,
        email,
        orderId,
      });

      const { token } = response.data;

      const config = {
        root: "",
        flow: "DEFAULT",
        data: {
          orderId,
          token,
          tokenType: "TXN_TOKEN",
          amount: subTotal.toString(),
        },
        handler: {
          notifyMerchant: function (eventName, data) {
            console.log("Paytm Event:", eventName, data);
          },
        },
      };

      if (window.Paytm && window.Paytm.CheckoutJS) {
        window.Paytm.CheckoutJS.init(config)
          .then(() => {
            window.Paytm.CheckoutJS.invoke();
          })
          .catch((err) => {
            console.error("Paytm SDK Error:", err);
            toast.error("Paytm Initialization Failed");
          });
      } else {
        toast.error("Paytm SDK not loaded");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while initiating payment.");
    }
  };

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    // Load Paytm JS SDK
    const existingScript = document.getElementById("paytm-checkout-js");

    if (!existingScript) {
      const script = document.createElement("script");
      script.src =
        "https://securegw-stage.paytm.in/merchantpgpui/checkoutjs/merchants/YOUR_PAYTM_MID.js"; // Replace YOUR_PAYTM_MID
      script.id = "paytm-checkout-js";
      script.crossOrigin = "anonymous";
      document.body.appendChild(script);
    }
  }, [user]);

  return (
    <div className="container mx-2 sm:mx-auto">
      <Head>
        <title>Checkout</title>
        <meta name="description" content="Codeswear - Engineered For Excellence" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="font-bold text-3xl text-center my-8">Checkout</h1>
      <h2 className="text-xl font-semibold">1. Delivery Details</h2>
      <form onSubmit={handleSubmit}>
        {/* Delivery Details Form */}
        <div className="mx-auto flex">
          <div className="px-2 w-1/2">
            <label className="text-sm">Name</label>
            <input
              name="name"
              value={formValues.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-1"
              type="text"
              autoComplete="off"
            />
          </div>
          <div className="px-2 w-1/2">
            <label className="text-sm">Email</label>
            <input
              name="email"
              value={formValues.email}
              onChange={handleChange}
              className="w-full border rounded px-3 py-1"
              type="email"
              autoComplete="off"
            />
          </div>
        </div>

        <div className="px-2">
          <label className="text-sm">Address</label>
          <textarea
            name="address"
            value={formValues.address}
            onChange={handleChange}
            rows="2"
            className="w-full border rounded px-3 py-1"
          />
        </div>

        <div className="mx-auto flex">
          <div className="px-2 w-1/2">
            <label className="text-sm">Phone</label>
            <input
              name="phone"
              value={formValues.phone}
              onChange={handleChange}
              className="w-full border rounded px-3 py-1"
              type="tel"
            />
          </div>
          <div className="px-2 w-1/2">
            <label className="text-sm">ZIP Code</label>
            <input
              name="zipcode"
              value={formValues.zipcode}
              onChange={handleChange}
              className="w-full border rounded px-3 py-1"
              type="text"
            />
          </div>
        </div>

        <div className="mx-auto flex">
          <div className="px-2 w-1/2">
            <label className="text-sm">State</label>
            <input
              readOnly
              name="state"
              value={formValues.state}
              className="w-full border rounded px-3 py-1 bg-gray-100"
              type="text"
            />
          </div>
          <div className="px-2 w-1/2">
            <label className="text-sm">City</label>
            <input
              readOnly
              name="city"
              value={formValues.city}
              className="w-full border rounded px-3 py-1 bg-gray-100"
              type="text"
            />
          </div>
        </div>

        <h2 className="text-xl font-semibold mt-8">2. Review Cart Items</h2>
        <div className="bg-pink-100 mt-4 p-6 rounded-md">
          {Object.keys(cart).length === 0 ? (
            <div className="text-center font-semibold">Your cart is empty</div>
          ) : (
            <ol className="list-decimal">
              {Object.keys(cart).map((k) => (
                <li key={k} className="my-3">
                  <div className="flex justify-between">
                    <span>{cart[k].name}</span>
                    <span className="flex items-center gap-2">
                      <AiOutlineMinus
                        className="cursor-pointer"
                        onClick={() =>
                          removeFromCart(
                            k,
                            1,
                            cart[k].price,
                            cart[k].name,
                            cart[k].size,
                            cart[k].variant
                          )
                        }
                      />
                      {cart[k].qty}
                      <AiOutlinePlus
                        className="cursor-pointer"
                        onClick={() =>
                          addToCart(
                            k,
                            1,
                            cart[k].price,
                            cart[k].name,
                            cart[k].size,
                            cart[k].variant
                          )
                        }
                      />
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          )}
          <div className="mt-4 font-bold">Total: Rs {subTotal}</div>
        </div>

        <button
          type="submit"
          className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-6 mt-6 rounded"
        >
          Pay Rs {subTotal}
        </button>
      </form>
    </div>
  );
};

export default Checkout;


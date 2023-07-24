import express from "express";
import stripe from "stripe";
import dotenv from "dotenv";
import User from "./../models/userModel.js";
dotenv.config({ path: "./.env.development.local" });
const stripeInstance = stripe(process.env.STRIPE_KEY);
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

export const createSession = async (req, res) => {
  const customer = await stripeInstance.customers.create({
    metadata: {
      userId: req.user._id.toString(),
      creditsAmount: req.body.credits.toString(),
    },
  });
  const session = await stripeInstance.checkout.sessions.create({
    line_items: [
      {
        price: req.body.priceId,
        quantity: 1,
      },
    ],
    mode: "payment",
    customer: customer.id,
    success_url: `${process.env.CLIENT_ROUTE}/generation`,
    cancel_url: `${process.env.CLIENT_ROUTE}/pricing`,
  });
  res.json({ url: session.url });
};

export const webHook = async (request, response) => {
  const sig = request.headers["stripe-signature"];
  let event;
  try {
    event = stripeInstance.webhooks.constructEvent(
      request.body,
      sig,
      endpointSecret
    );
  } catch (err) {
    console.log(err.message);
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  switch (event.type) {
    case "payment_intent.succeeded":
      const data = event.data.object;
      const customerId = data.customer;
      if (customerId) {
        try {
          const customer = await stripeInstance.customers.retrieve(customerId);
          const userId = customer.metadata.userId;
          const creditsToAdd = parseInt(customer.metadata.creditsAmount, 10);
          await User.findByIdAndUpdate(userId, {
            $inc: { credits: creditsToAdd },
          });
        } catch (err) {}
      } else {
      }
      break;
    default:
  }

  response.send();
};

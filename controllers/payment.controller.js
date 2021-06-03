const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2021-06-15",
});

exports.payment = async (req, res) => {
  const { paymentMethodType, currency } = req.body;

  const params = {
    payment_method_types: [paymentMethodType],
    currency: currency,
    amount: 2222,
  };

  try {
    const paymentIntent = await stripe.paymentIntents.create(params);

    //   {
    //     amount: "1000",
    //     currency: "eur",
    //     //customer: customer.id,
    //     //description: "okkkkk",
    //     // billing_details: {
    //     //   email: token.email,
    //     //   phone: token.phone,
    //     // },
    //     // shipping: {
    //     //   name: token.card.name,
    //     //   address: {
    //     //     country: token.card.address_country,
    //     //   },
    //     // },
    //   },

    // Send publishable key and PaymentIntent details to client
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    return res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
};

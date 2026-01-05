const razorpay = require("razorpay");
const crypto = require("crypto");
const User = require("../model/User");

const instance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (req, res) => {
  try {

    const order = await instance.orders.create({
      amount: 1000 * 100,
      currency: "INR",
    });

    res.status(200).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Order creation failed" });
  }
};

const verifyPayment = async (req, res) => {
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    product,
    email,
  } = req.body;


  try {
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid signature" });
    }

    const user = await User.findOne({ email }).exec();
    if (!user) return res.sendStatus(401);

    user.roles = { Admin: 5150 };
    await user.save();

    res.status(200).json({
      success: true,
      message: `Payment successful`,
      paymentId: razorpay_payment_id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Payment verification failed" });
  }
};

module.exports = { createOrder, verifyPayment };

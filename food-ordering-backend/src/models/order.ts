import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  deliveryDetails: {
    email: { type: String, required: false },
    name: { type: String, required: false },
    addressLine1: { type: String, required: false },
    city: { type: String, required: false },
  },
  cartItems: [
    {
      menuItemId: { type: String, required: false },
      quantity: { type: String, required: false },
      name: { type: Number, required: false },
    },
  ],
  totalAmount: String,
  status: {
    type: String,
    enum: ["placed", "paid", "inProgress", "outForDelivery"],
  },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", orderSchema);
export default Order;

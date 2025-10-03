import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true }, 
        price: { type: Number, required: true }, 
        quantity: { type: Number, default: 1 },
      },
    ],
    payment: {
      id: { type: String, required: true }, 
      method: { type: String, required: true },
      amount: { type: Number, required: true },
      currency: { type: String, default: "USD" },
      status: { type: String, default: "Pending" }, 
      rawResponse: { type: Object }, 
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      default: "Not Processed",
      enum: ["Not Processed", "Processing", "Shipped", "Delivered", "Cancelled"],
    },
    deliveredAt: { type: Date }, 
    cancelledAt: { type: Date }, 
  },
  { timestamps: true }
);


orderSchema.index({ buyer: 1 });

export default mongoose.model("Order", orderSchema);

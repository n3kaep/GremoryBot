const { Schema, model } = require("mongoose");

const StoreSchema = new Schema({
  totalSales: { type: Number, default: 0 },
  averageRating: { type: Number, default: 5.0 },
  deliveryTime: { type: String, default: "5-15 minutos" },
  stockItems: [
    {
      name: String,
      quantity: Number,
      price: Number,
    },
  ],
});

module.exports = model("StoreData", StoreSchema);
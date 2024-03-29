import mongoose, { Document, Schema } from 'mongoose';

interface IGrocery extends Document {
  name: string;
  price: number;
  inventory: number;
}

const grocerySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: {
      type: Number,
      required: true,
    },
    inventory: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

const GroceryModel = mongoose.model<IGrocery>('grocery', grocerySchema);

export default GroceryModel;

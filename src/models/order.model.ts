import mongoose, { Document } from 'mongoose';

export interface IItemList {
  id: string;
  quantity: number;
}
interface IOrder extends Document {
  createdBy: string;
  itemList: IItemList[];
}

const orderSchema = new mongoose.Schema(
  {
    createdBy: { type: mongoose.Schema.ObjectId, required: true, rel: 'User' },
    itemList: [
      {
        id: {
          type: mongoose.Schema.ObjectId,
          required: true,
          rel: 'grocery',
        },
        quantity: {
          type: Number,
          required: true,
          default: 0,
        },
      },
    ],
  },
  { timestamps: true }
);

const OrderModel = mongoose.model<IOrder>('Order', orderSchema);

export default OrderModel;

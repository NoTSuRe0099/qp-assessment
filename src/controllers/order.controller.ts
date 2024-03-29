import { NextFunction, Request, Response } from 'express';
import { asyncErrorHandler } from '../ErrorHandlers';
import GroceryModel from '../models/grocery.model';
import OrderModel, { IItemList } from '../models/order.model';
import { sendApiResponse } from '../functions';
import mongoose from 'mongoose';

class OrderController {
  private groceryModel: typeof GroceryModel;
  private orderModel: typeof OrderModel;

  constructor() {
    this.groceryModel = GroceryModel;
    this.orderModel = OrderModel;
  }

  createOrder = asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const orderList: IItemList[] = req.body;

      const items = await this.groceryModel.find({
        _id: { $in: orderList?.map((it: IItemList) => it?.id) },
      });

      let errorList: {
        name: string | undefined;
        id: any;
        inventorySize: number | undefined;
        orderQty: number;
        message: string;
      }[] = [];

      orderList?.forEach((it) => {
        const item = items?.find(
          (el) => el?._id.toString() === it?.id?.toString()
        );

        if (it?.quantity > (item?.inventory || 0)) {
          errorList.push({
            name: item?.name,
            id: item?._id,
            inventorySize: item?.inventory,
            orderQty: it?.quantity,
            message: `Order Quantity (${it?.quantity}) exciding inventory size (${item?.inventory})`,
          });
        }
      });

      if (errorList?.length) {
        return sendApiResponse(
          res,
          errorList,
          'Order Quantity has exceded',
          400
        );
      }

      const updateOperations = items?.map((it) => ({
        updateOne: {
          filter: { _id: it._id },
          update: {
            inventory:
              it?.inventory - +orderList?.find((el) => el?.id)?.quantity! || 0,
          },
        },
      }));

      if (updateOperations.length > 0) {
        const updates = await this.groceryModel.bulkWrite(updateOperations);
        console.log('Inventory updated successfully.', updates);
      } else {
        console.log('No items to update.');
      }

      return sendApiResponse(res, null, 'Order Created Successfull');
    }
  );
}

export default OrderController;

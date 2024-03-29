import { NextFunction } from 'express';
import { Request, Response } from 'express';
import GroceryModel from '../models/grocery.model';
import { asyncErrorHandler } from '../ErrorHandlers';
import { GroceryData } from '../validations/grocery.validations';
import { sendApiResponse } from '../functions';
import mongoose from 'mongoose';

class GroceryController {
  private groceryModel: typeof GroceryModel;

  constructor() {
    this.groceryModel = GroceryModel;
  }

  createItem = asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data: GroceryData = req?.body;
      const item = await this.groceryModel.create(data);
      return sendApiResponse(res, item, 'New Item Created Successfully', 201);
    }
  );

  getAllItems = asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const items = await this.groceryModel.find();
      return sendApiResponse(res, items);
    }
  );

  updateItem = asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req?.params;
      if (!mongoose.isValidObjectId(id)) {
        return sendApiResponse(res, null, 'Invalid Product Id!', 400);
      }
      const item = await this.groceryModel.findById(id);
      if (!item) {
        return sendApiResponse(res, null, 'Product Not Found!', 404);
      }

      const data: GroceryData = req?.body;
      const updatedItem = await this.groceryModel.findByIdAndUpdate(id, data, {
        new: true,
      });

      return sendApiResponse(
        res,
        updatedItem,
        'Item Updated Successfully',
        201
      );
    }
  );

  deleteItem = asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params; // Access the ID from request params
      if (!id) {
        return sendApiResponse(res, null, 'Please Provide Product Id!', 400);
      }
      if (!mongoose.isValidObjectId(id)) {
        return sendApiResponse(res, null, 'Invalid Product Id!', 400);
      }
      const item = await this.groceryModel.findById(id);
      if (!item) {
        return sendApiResponse(res, null, 'Product Not Found!', 404);
      }

      await this.groceryModel.findByIdAndDelete(id);

      return sendApiResponse(res, null, 'Item Deleted Successfully', 200);
    }
  );

  getItem = asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params; // Access the ID from request params
      if (!id) {
        return sendApiResponse(res, null, 'Please Provide Product Id!', 400);
      }
      if (!mongoose.isValidObjectId(id)) {
        return sendApiResponse(res, null, 'Invalid Product Id!', 400);
      }
      const item = await this.groceryModel.findById(id);
      return sendApiResponse(res, item);
    }
  );
}

export default GroceryController;

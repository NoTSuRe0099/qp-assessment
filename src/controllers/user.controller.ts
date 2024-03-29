import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel, { userRoles } from '../models/user.model';
import { cookieOptions } from '../constants';
import { asyncErrorHandler } from '../ErrorHandlers';
import { sendApiResponse } from '../functions';

class UserController {
  private userModel: typeof UserModel;

  constructor() {
    this.userModel = UserModel;
  }

  register = asyncErrorHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const { email, password } = req?.body;

      if (!email || !password) {
        return res.status(500).json({
          data: null,
          success: false,
          message: 'Please enter email & password',
        });
      }

      const exists = await this.userModel.findOne({ email });

      if (exists) {
        return res.status(500).json({
          data: null,
          success: false,
          message: 'Email already exists',
        });
      }

      const newUser = new this.userModel({
        email,
        password: bcrypt.hashSync(password, 10),
      });

      await newUser.save();

      const accessToken = jwt.sign(
        { id: newUser._id, role: newUser.role },
        process.env.JWT_SECRET || '',
        {
          expiresIn: '1d',
        }
      );

      return res
        .status(201)
        .cookie('access_token', accessToken, cookieOptions)
        .json({
          data: null,
          success: true,
          message: 'Registration Successful.',
        });
    }
  );

  login = asyncErrorHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const { email, password } = req?.body;

      if (!email || !password) {
        return res.status(500).json({
          data: null,
          success: false,
          message: 'Please enter email & password',
        });
      }

      const user = await this.userModel.findOne({ email }).select('+password');

      if (!user) {
        return res.status(500).json({
          data: null,
          success: false,
          message: 'Email or password is wrong',
        });
      }

      const isMatch: boolean = await bcrypt.compare(
        password,
        user?.password || ''
      );

      if (!isMatch) {
        return res.status(500).json({
          data: null,
          success: true,
          message: 'Email or password is wrong',
        });
      }

      const accessToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || '',
        {
          expiresIn: '1d',
        }
      );

      return res
        .status(200)
        .cookie('access_token', accessToken, cookieOptions)
        .json({
          data: null,
          success: true,
          message: 'Logged in Successfully',
        });
    }
  );

  getUserDetails = asyncErrorHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const { userId } = req;
      const user = await this.userModel.findById(userId);

      return res.status(200).json({
        data: user,
        success: true,
        message: '',
      });
    }
  );

  getAllUsers = asyncErrorHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const users = await this.userModel
        .find({ _id: { $ne: req?.userId } })
        .select('-email -createdAt -updatedAt -__v');

      return res.status(200).json({
        data: users,
        success: true,
        message: '',
      });
    }
  );

  logout = asyncErrorHandler(
    async (req: Request, res: Response): Promise<Response> => {
      return res.status(200).cookie('access_token', null, cookieOptions).json({
        data: null,
        success: true,
        message: 'Logged out Successfully',
      });
    }
  );

  updateToAdminRoleById = asyncErrorHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const { userId } = req;
      const user = await this.userModel.findById(userId);

      if (!user) {
        return sendApiResponse(res, null, 'User Not Found!', 400);
      }

      user.role = userRoles.admin;
      await user.save();

      return sendApiResponse(
        res,
        user,
        "User's role Updated successfully.",
        200
      );
    }
  );
}

export default UserController;

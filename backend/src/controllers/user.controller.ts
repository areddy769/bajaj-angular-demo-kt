import { NextFunction, Request, Response } from 'express';
import {
  createUserSchema,
  updateUserSchema,
  updateUserStatusSchema,
  userQuerySchema,
} from '../validators/user.validator';
import * as userService from '../services/user.service';
import { ok } from '../utils/api-response';

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const params = userQuerySchema.parse(req.query);
    const result = await userService.listUsers(params);
    res.status(200).json(ok('Users fetched', result));
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await userService.getUserById(Number(req.params['id']));
    res.status(200).json(ok('User fetched', user));
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = createUserSchema.parse(req.body);
    const user = await userService.createUser(input);
    res.status(201).json(ok('User created', user));
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = updateUserSchema.parse(req.body);
    const user = await userService.updateUser(Number(req.params['id']), input);
    res.status(200).json(ok('User updated', user));
  } catch (err) {
    next(err);
  }
}

export async function updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { status } = updateUserStatusSchema.parse(req.body);
    const user = await userService.updateUserStatus(Number(req.params['id']), status);
    res.status(200).json(ok('User status updated', user));
  } catch (err) {
    next(err);
  }
}

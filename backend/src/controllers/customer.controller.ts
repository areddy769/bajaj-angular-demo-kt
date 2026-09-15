import { NextFunction, Request, Response } from 'express';
import { customerQuerySchema, customerSchema, updateCustomerSchema } from '../validators/customer.validator';
import * as customerService from '../services/customer.service';
import { ok } from '../utils/api-response';

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const params = customerQuerySchema.parse(req.query);
    const result = await customerService.listCustomers(params);
    res.status(200).json(ok('Customers fetched', result));
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const customer = await customerService.getCustomerById(Number(req.params['id']));
    res.status(200).json(ok('Customer fetched', customer));
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = customerSchema.parse(req.body);
    const customer = await customerService.createCustomer(input);
    res.status(201).json(ok('Customer created', customer));
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = updateCustomerSchema.parse(req.body);
    const customer = await customerService.updateCustomer(Number(req.params['id']), input);
    res.status(200).json(ok('Customer updated', customer));
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await customerService.deleteCustomer(Number(req.params['id']));
    // 200 with a message keeps the response shape consistent for the Angular demo
    // (a 204 would have no body). Documented in README.
    res.status(200).json(ok('Customer deleted', null));
  } catch (err) {
    next(err);
  }
}

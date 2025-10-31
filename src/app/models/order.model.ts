import { CartItem } from './cart.model';
import { User } from './user.model';

export interface Order {
  id?: any;
  userId: number;
  user?: User;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: string;
  paymentMethod: string;
  createdAt?: string;
  updatedAt?: string;
}
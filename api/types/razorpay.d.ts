export interface RazorpayRequest {
  account_id: string;
  contains: string[];
  created_at: number;
  entity: string;
  event: string;
  payload: Payload;
}

export interface Payload {
  order: Order;
  payment: Payment;
  payment_link: PaymentLink;
}

export interface Order {
  entity: OrderEntity;
}

export interface OrderEntity {
  amount: number;
  amount_due: number;
  amount_paid: number;
  attempts: number;
  created_at: number;
  currency: string;
  entity: string;
  id: string;
  notes: never[];
  offer_id: null;
  receipt: null;
  status: string;
}

export interface Payment {
  entity: PaymentEntity;
}

export interface PaymentEntity {
  acquirer_data: AcquirerData;
  amount: number;
  amount_refunded: number;
  amount_transferred: number;
  bank: null;
  base_amount: number;
  captured: boolean;
  card: Card;
  card_id: string;
  contact: string;
  created_at: number;
  currency: string;
  description: string;
  email: string;
  entity: string;
  error_code: null;
  error_description: null;
  error_reason: null;
  error_source: null;
  error_step: null;
  fee: number;
  fee_bearer: string;
  id: string;
  international: boolean;
  invoice_id: null;
  method: string;
  notes: never[];
  order_id: string;
  refund_status: null;
  status: string;
  tax: number;
  vpa: null;
  wallet: null;
}

export interface AcquirerData {
  auth_code: string;
}

export interface Card {
  emi: boolean;
  entity: string;
  id: string;
  international: boolean;
  issuer: null;
  last4: string;
  name: string;
  network: string;
  sub_type: string;
  token_iin: null;
  type: string;
}

export interface PaymentLink {
  entity: PaymentLinkEntity;
}

export interface PaymentLinkEntity {
  accept_partial: boolean;
  amount: number;
  amount_paid: number;
  cancelled_at: number;
  created_at: number;
  currency: string;
  customer: Customer;
  description: string;
  expire_by: number;
  expired_at: number;
  first_min_partial_amount: number;
  id: string;
  notes: null;
  notify: Notify;
  order_id: string;
  reference_id: string;
  reminder_enable: boolean;
  reminders: Reminders;
  short_url: string;
  status: string;
  updated_at: number;
  upi_link: boolean;
  user_id: string;
}

export interface RazorpayPaymentLinkRequest {
  amount: number;
  currency: string;
  accept_partial?: boolean;
  first_min_partial_amount?: number;
  description: string;
  customer: Customer;
  notify: Notify;
  reminder_enable?: boolean;
  notes?: Notes;
  callback_url?: string;
  callback_method?: string;
  reference_id: string;
  expire_by: number;
}

export interface Customer {
  contact?: string;
  email: string;
  name?: string;
}

export interface Notes {
  policy_name: string;
}

export interface Notify {
  email: boolean;
  sms: boolean;
}

export interface Reminders {
  status: string;
}

export interface RazorpayPaymentLinkResponse {
  accept_partial: boolean;
  amount: number;
  amount_paid: number;
  cancelled_at: number;
  created_at: number;
  currency: string;
  customer: Customer;
  description: string;
  expire_by: number;
  expired_at: number;
  first_min_partial_amount: number;
  id: string;
  notes: null;
  notify: Notify;
  payments: null;
  reference_id: string;
  reminder_enable: boolean;
  reminders: never[];
  short_url: string;
  status: string;
  updated_at: number;
  upi_link: boolean;
  user_id: string;
}

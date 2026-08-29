export type UUID = string;

export type BillType = "permanent" | "temporary";
export type OrderState = "created" | "finished" | "deleted";
export type PaymentType = "CASH" | "CARD";
export type ReceiptValidity = "valid" | "unnumbered";
export type TaxType =
  | "ADDED_TO_PRICE"
  | "INCLUDED_IN_PRICE"
  | "NO_TAX"
  | "CONSTANT"
  | "MULTIPLE";

export type Unit =
  | "pc" | "mg" | "g" | "dag" | "kg" | "oz" | "lb"
  | "ml" | "cl" | "l" | "gal" | "pt" | "mm" | "m";

export interface BillItemResponse {
  note?: string;
  itemId: UUID;
  itemName: string;
  itemPrice: number;
  itemQuantity: number;
  priceToPay: number;
}

export interface BillResponse {
  billId: UUID;
  name: string;
  total: number;
  billType: BillType;
  billNum: number;
  customerId?: UUID;
}

export interface GetBillResponse extends BillResponse {
  items?: BillItemResponse[];
}

export interface CategoryResponse {
  categoryId: UUID;
  parentCategoryId?: UUID;
  name: string;
  color: number;
}

export interface CategoriesResponse {
  categories?: CategoryResponse[];
}

export interface PublicSubjectResponse {
  subjectId: UUID;
  name: string;
  email?: string;
  phone?: string;
  note?: string;
  loyaltyId?: string;
}

export interface PublicSupplierResponse {
  subjectId: UUID;
  name: string;
  email?: string;
  phone?: string;
  note?: string;
}

export interface GetCustomersResponse {
  customers?: PublicSubjectResponse[];
}

export interface GetSuppliersResponse {
  suppliers?: PublicSupplierResponse[];
}

export interface CreateCustomerResponse {
  customerId: UUID;
}

export interface CreateSupplierResponse {
  supplierId: UUID;
}

export interface VoidResponse {
  voidResponse?: string;
}

export interface ItemResponse {
  itemId: UUID;
  code: number;
  itemName: string;
  text: string;
  taxId: UUID;
  price?: number;
  currency: string;
  color: number;
  sku?: string;
  categoryId?: UUID;
  note?: string;
  priceStr?: string;
  categoryName?: string;
  onSale?: boolean;
}

export interface ItemsResponse {
  items?: ItemResponse[];
}

export interface AddItemResponse {
  itemId?: UUID;
}

export interface CreateOrderResponse {
  billId?: UUID;
}

export interface CreateOrdersResponse {
  billId?: UUID;
}

export interface GetOrderResponse {
  note?: string;
  orderId: UUID;
  orderNum: number;
  billName: string;
  billNum: number;
  billType: BillType;
  text: string;
  quantity: number;
  createUserName?: string;
  orderState: OrderState;
}

export interface ReceiptItemAdditionalTaxResponse {
  taxPercent: number;
  taxConstant: number;
  taxName: string;
  taxId: UUID;
  taxValue: number;
}

export interface ReceiptItemResponse {
  receiptItemId: UUID;
  text: string;
  itemPrice: number;
  quantity: number;
  taxPercent: number;
  taxConstant: number;
  taxName: string;
  taxId: UUID;
  priceToPay: number;
  priceWithoutTax: number;
  taxValue: number;
  code: number;
  sku?: string;
  additionalTaxes?: ReceiptItemAdditionalTaxResponse[];
  itemId?: UUID;
  categoryId?: UUID;
  type: string;
  parentReceiptItemId?: UUID;
}

export interface ReceiptResponse {
  id: UUID;
  dateTime: string;
  buyer?: string;
  cashRegister: string;
  note?: string;
  receiptNumber: string;
  total: number;
  currency: string;
  paymentType: PaymentType;
  userName: string;
  createdDT?: string;
  modifiedDT?: string;
  validity?: ReceiptValidity;
  amountReceived?: number;
  shiftCode?: string;
  originalReceiptId?: UUID;
  items: ReceiptItemResponse[];
}

export interface GetReceiptListResponse {
  receipts: ReceiptResponse[];
  complete: boolean;
}

export interface ActualStockDataResponse {
  sku: string;
  item: string;
  quantity: number;
  unit: Unit;
  lowQuantity: boolean;
}

export interface GetActualStockDataResponse {
  list?: ActualStockDataResponse[];
}

export interface StockChangesResponse {
  sku: string;
  quantity: number;
  unit: Unit;
}

export interface GetStockChangesResponse {
  changes: StockChangesResponse[];
  syncTimestamp: number;
}

export interface AddStockChangeResponse {
  sku?: string;
  result: "updated" | "noSku" | "invalidUnit" | "duplicated" | string;
}

export interface UpdateStockItemResponse {
  sku?: string;
  result: "updated" | "noSku" | "invalidUnit" | "noChange" | string;
}

export interface UpdateStockResponse {
  items: UpdateStockItemResponse[];
}

export interface TaxResponse {
  taxId: UUID;
  name: string;
  percent?: number;
  constant?: number;
  taxType: TaxType | string;
  relatedTaxes?: UUID[];
  deleted: boolean;
}

export interface TaxesResponse {
  taxes?: TaxResponse[];
}

export interface GetWebhookStatusResponse {
  url?: string;
  status: "initialized" | "healthy" | "warning" | "error" | "off" | string;
  active: boolean;
  errorMessage?: string;
}

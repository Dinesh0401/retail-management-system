export interface ProductSalesAggregate {
  product_id: string;
  total_quantity: number;
  total_amount: number;
  transaction_count: number;
}

export interface BranchSalesAggregate {
  branch_id: string;
  total_quantity: number;
  total_amount: number;
  transaction_count: number;
}

export interface SalesAnalysisData {
  total_sales_amount: number;
  total_units_sold: number;
  total_transactions: number;
  sales_by_product: ProductSalesAggregate[];
  sales_by_branch: BranchSalesAggregate[];
  top_selling_products: ProductSalesAggregate[];
}

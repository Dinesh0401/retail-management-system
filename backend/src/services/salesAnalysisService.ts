import { getSales } from './saleService';
import { SalesAnalysisData, ProductSalesAggregate, BranchSalesAggregate } from '../types/salesAnalysis';

export const getSalesAnalysis = async (): Promise<SalesAnalysisData> => {
  const sales = await getSales();

  let total_sales_amount = 0;
  let total_units_sold = 0;
  const total_transactions = sales.length;

  const productMap: Record<string, ProductSalesAggregate> = {};
  const branchMap: Record<string, BranchSalesAggregate> = {};

  for (const sale of sales) {
    // Total values are likely strings from pg numeric depending on driver, so we parse them if necessary, 
    // but in TypeScript we typed them as numbers. Let's ensure they are treated as numbers.
    const qty = Number(sale.quantity) || 0;
    const amt = Number(sale.total_amount) || 0;

    total_sales_amount += amt;
    total_units_sold += qty;

    // Aggregate by product
    if (!productMap[sale.product_id]) {
      productMap[sale.product_id] = {
        product_id: sale.product_id,
        total_quantity: 0,
        total_amount: 0,
        transaction_count: 0,
      };
    }
    productMap[sale.product_id].total_quantity += qty;
    productMap[sale.product_id].total_amount += amt;
    productMap[sale.product_id].transaction_count += 1;

    // Aggregate by branch
    if (!branchMap[sale.branch_id]) {
      branchMap[sale.branch_id] = {
        branch_id: sale.branch_id,
        total_quantity: 0,
        total_amount: 0,
        transaction_count: 0,
      };
    }
    branchMap[sale.branch_id].total_quantity += qty;
    branchMap[sale.branch_id].total_amount += amt;
    branchMap[sale.branch_id].transaction_count += 1;
  }

  const sales_by_product = Object.values(productMap);
  const sales_by_branch = Object.values(branchMap);

  // Top selling products (sort by quantity desc, then amount desc)
  const top_selling_products = [...sales_by_product]
    .sort((a, b) => {
      if (b.total_quantity !== a.total_quantity) {
        return b.total_quantity - a.total_quantity;
      }
      return b.total_amount - a.total_amount;
    })
    .slice(0, 5);

  return {
    total_sales_amount,
    total_units_sold,
    total_transactions,
    sales_by_product,
    sales_by_branch,
    top_selling_products,
  };
};

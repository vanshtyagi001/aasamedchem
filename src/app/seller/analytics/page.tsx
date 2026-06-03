import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { 
  BarChart3, 
  Landmark, 
  ShoppingCart, 
  TrendingUp, 
  Percent, 
  Boxes, 
  Clock, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

export default async function SellerAnalyticsPage() {
  const session = await getSession();
  if (!session || session.role !== 'SELLER') {
    redirect('/login');
  }

  const sellerId = session.id;

  // 1. Fetch live products and orders
  const products = await prisma.product.findMany({
    where: { sellerId },
  });

  const orders = await prisma.order.findMany({
    where: { sellerId },
    include: { product: true },
  });

  // 2. Compute financial and conversion KPIs
  const totalProductsCount = products.length;
  const totalOrdersCount = orders.length;

  const successfulOrders = orders.filter(
    (o) => o.status === 'APPROVED' || o.status === 'COMPLETED'
  );

  const totalRevenueSum = successfulOrders.reduce(
    (sum, o) => sum + Number(o.totalPrice),
    0
  );

  const averageOrderValue =
    successfulOrders.length > 0
      ? totalRevenueSum / successfulOrders.length
      : 0;

  const quotationSuccessRate =
    totalOrdersCount > 0
      ? (successfulOrders.length / totalOrdersCount) * 100
      : 0;

  // 3. Compute status distribution funnel
  const pendingCount = orders.filter((o) => o.status === 'PENDING').length;
  const approvedCount = orders.filter((o) => o.status === 'APPROVED').length;
  const completedCount = orders.filter((o) => o.status === 'COMPLETED').length;
  const rejectedCount = orders.filter((o) => o.status === 'REJECTED').length;

  // 4. Product performance mapping (Best Sellers)
  const productPerformanceMap: Record<
    string,
    { name: string; cas: string; inquiriesCount: number; revenue: number }
  > = {};

  // Initialize with listed products to ensure all are shown
  products.forEach((p) => {
    productPerformanceMap[p.id] = { name: p.name, cas: p.casNumber, inquiriesCount: 0, revenue: 0 };
  });

  orders.forEach((o) => {
    if (!productPerformanceMap[o.productId]) {
      productPerformanceMap[o.productId] = {
        name: o.product?.name || 'Removed Product',
        cas: o.product?.casNumber || 'N/A',
        inquiriesCount: 0,
        revenue: 0,
      };
    }
    productPerformanceMap[o.productId].inquiriesCount += 1;
    if (o.status === 'APPROVED' || o.status === 'COMPLETED') {
      productPerformanceMap[o.productId].revenue += Number(o.totalPrice);
    }
  });

  const rankedProductsList = Object.values(productPerformanceMap).sort(
    (a, b) => b.revenue - a.revenue
  );

  // 5. Mock monthly data for progress chart (B2B trends)
  const monthlySourcingTrends = [
    { month: 'Jan', revenue: totalRevenueSum * 0.15 },
    { month: 'Feb', revenue: totalRevenueSum * 0.22 },
    { month: 'Mar', revenue: totalRevenueSum * 0.18 },
    { month: 'Apr', revenue: totalRevenueSum * 0.25 },
    { month: 'May', revenue: totalRevenueSum * 0.30 },
    { month: 'Jun', revenue: totalRevenueSum * 0.40 },
  ];

  const maxMonthValue = Math.max(...monthlySourcingTrends.map((t) => t.revenue), 1);

  return (
    <div className="space-y-8 py-4">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-600" /> Procurement Analytics Dashboard
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">Evaluate bulk order volumes, quotation success margins, and product catalogs</p>
      </div>

      {/* Core KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg w-fit">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">Sourced Revenue</span>
            <span className="text-xl font-bold text-gray-900 mt-1 block">₹{totalRevenueSum.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg w-fit">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">Average Order Value</span>
            <span className="text-xl font-bold text-gray-900 mt-1 block">₹{Math.round(averageOrderValue).toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg w-fit">
            <Percent className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">Conversion Rate</span>
            <span className="text-xl font-bold text-gray-900 mt-1 block">{quotationSuccessRate.toFixed(1)}%</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg w-fit">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">Total Catalog SKUs</span>
            <span className="text-xl font-bold text-gray-900 mt-1 block">{totalProductsCount} items</span>
          </div>
        </div>

      </div>

      {/* Performance Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CSS Chart: Sourcing Revenue Trend */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm lg:col-span-2 space-y-6">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Procurement Sales Performance (H1 Trend)</h2>
          <div className="h-64 flex items-end justify-between gap-4 pt-4 border-b border-gray-100">
            {monthlySourcingTrends.map((t) => {
              // Calculate percentage height securely
              const heightPercent = (t.revenue / maxMonthValue) * 100;
              return (
                <div key={t.month} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="text-[10px] font-bold text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    ₹{Math.round(t.revenue).toLocaleString()}
                  </div>
                  <div 
                    style={{ height: `${Math.max(heightPercent, 5)}%` }}
                    className="w-full bg-blue-600 rounded-t hover:bg-blue-700 transition-all duration-500 shadow-sm"
                  />
                  <span className="text-xs font-semibold text-gray-500 mt-1">{t.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Funnel Section: Quotation Queue Status Funnel */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Quotation Funnel Status</h2>
          
          <div className="space-y-4 pt-2">
            
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-gray-600">
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-yellow-600" /> Pending Review</span>
                <span>{pendingCount} quotes</span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  style={{ width: `${totalOrdersCount > 0 ? (pendingCount / totalOrdersCount) * 100 : 0}%` }}
                  className="bg-yellow-500 h-full rounded-full"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-gray-600">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Approved Offers</span>
                <span>{approvedCount} quotes</span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  style={{ width: `${totalOrdersCount > 0 ? (approvedCount / totalOrdersCount) * 100 : 0}%` }}
                  className="bg-blue-600 h-full rounded-full"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-gray-600">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Completed Deals</span>
                <span>{completedCount} quotes</span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  style={{ width: `${totalOrdersCount > 0 ? (completedCount / totalOrdersCount) * 100 : 0}%` }}
                  className="bg-emerald-500 h-full rounded-full"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-gray-600">
                <span className="flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5 text-red-600" /> Rejected Requests</span>
                <span>{rejectedCount} quotes</span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  style={{ width: `${totalOrdersCount > 0 ? (rejectedCount / totalOrdersCount) * 100 : 0}%` }}
                  className="bg-red-500 h-full rounded-full"
                />
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Sourcing Leaderboard Table */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Material Sourcing Leaderboard (SKU Revenue Rank)</h2>
        
        {rankedProductsList.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-6">Your product catalog is empty. Stock items to display performance.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 text-left text-xs font-medium text-gray-700">
              <thead className="bg-slate-50 text-gray-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-3">Material / Chemical Name</th>
                  <th className="px-6 py-3">CAS Registry</th>
                  <th className="px-6 py-3 text-right">Inquiries Received</th>
                  <th className="px-6 py-3 text-right">Total Revenue Generated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rankedProductsList.map((p, idx) => (
                  <tr key={p.cas} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-bold text-gray-900 flex items-center gap-2">
                      <span className="text-gray-400">#{idx + 1}</span>
                      <span>{p.name}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-mono">{p.cas}</td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-900">{p.inquiriesCount} times</td>
                    <td className="px-6 py-4 text-right font-bold text-gray-950">₹{p.revenue.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
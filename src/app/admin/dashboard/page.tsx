import AdminNav from "@/components/layout/AdminNav";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { orders, products, users, payments } from "@/lib/mockData";

export default function AdminDashboardPage() {
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const totalCustomers = users.filter((u) => u.role === "customer").length;
  const totalProducts = products.length;

  const bestSellingProduct = products.reduce((best, product) =>
    product.reviewCount > best.reviewCount ? product : best
  );

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      <AdminNav />

      <div className="container-custom py-8">
        <h1 className="text-3xl font-bold text-text-primary mb-8">Dashboard Overview</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-text-muted text-sm font-medium">Total Revenue</h3>
              <span className="text-2xl">💰</span>
            </div>
            <p className="text-3xl font-bold text-primary">
              ฿{totalRevenue.toLocaleString()}
            </p>
            <p className="text-sm text-text-muted mt-2">From {totalOrders} orders</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-text-muted text-sm font-medium">Total Orders</h3>
              <span className="text-2xl">🛒</span>
            </div>
            <p className="text-3xl font-bold text-text-primary">{totalOrders}</p>
            <p className="text-sm text-text-muted mt-2">All time</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-text-muted text-sm font-medium">Customers</h3>
              <span className="text-2xl">👥</span>
            </div>
            <p className="text-3xl font-bold text-text-primary">{totalCustomers}</p>
            <p className="text-sm text-text-muted mt-2">Registered users</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-text-muted text-sm font-medium">Products</h3>
              <span className="text-2xl">📦</span>
            </div>
            <p className="text-3xl font-bold text-text-primary">{totalProducts}</p>
            <p className="text-sm text-text-muted mt-2">In catalog</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Best Selling Product
            </h2>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-background rounded-lg relative">
                <img
                  src={bestSellingProduct.image}
                  alt={bestSellingProduct.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-text-primary">
                  {bestSellingProduct.name}
                </h3>
                <p className="text-sm text-text-muted">
                  {bestSellingProduct.reviewCount} reviews
                </p>
                <p className="text-lg font-bold text-primary mt-1">
                  ฿{bestSellingProduct.price.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Quick Stats</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-text-muted">Pending Orders</span>
                <span className="font-semibold text-text-primary">
                  {orders.filter((o) => o.status === "pending").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Shipped Orders</span>
                <span className="font-semibold text-text-primary">
                  {orders.filter((o) => o.status === "shipped").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Completed Orders</span>
                <span className="font-semibold text-text-primary">
                  {orders.filter((o) => o.status === "completed").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Products in Stock</span>
                <span className="font-semibold text-text-primary">
                  {products.filter((p) => p.stock > 0).length}
                </span>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-text-muted/10">
                  <th className="text-left py-3 px-4 text-text-muted font-medium">Order #</th>
                  <th className="text-left py-3 px-4 text-text-muted font-medium">Customer</th>
                  <th className="text-left py-3 px-4 text-text-muted font-medium">Date</th>
                  <th className="text-left py-3 px-4 text-text-muted font-medium">Total</th>
                  <th className="text-left py-3 px-4 text-text-muted font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-text-muted/10">
                    <td className="py-3 px-4 text-text-primary font-medium">
                      {order.orderNumber}
                    </td>
                    <td className="py-3 px-4 text-text-primary">
                      {order.shippingInfo.name}
                    </td>
                    <td className="py-3 px-4 text-text-muted">
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-text-primary font-semibold">
                      ฿{order.total.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          order.status === "completed"
                            ? "success"
                            : order.status === "shipped"
                            ? "primary"
                            : "warning"
                        }
                      >
                        {order.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

import AdminNav from "@/components/layout/AdminNav";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { payments } from "@/lib/mockData";

export default function AdminPaymentsPage() {
  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="min-h-screen bg-background">
      <AdminNav />

      <div className="container-custom py-8">
        <h1 className="text-3xl font-bold text-text-primary mb-8">Payment Records</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="p-6">
            <h3 className="text-text-muted text-sm font-medium mb-2">Total Payments</h3>
            <p className="text-3xl font-bold text-primary">
              ฿{totalAmount.toLocaleString()}
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-text-muted text-sm font-medium mb-2">Completed</h3>
            <p className="text-3xl font-bold text-text-primary">
              {payments.filter((p) => p.status === "completed").length}
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-text-muted text-sm font-medium mb-2">Pending</h3>
            <p className="text-3xl font-bold text-text-primary">
              {payments.filter((p) => p.status === "pending").length}
            </p>
          </Card>
        </div>

        <Card className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-text-muted/10">
                  <th className="text-left py-3 px-4 text-text-muted font-medium">Payment ID</th>
                  <th className="text-left py-3 px-4 text-text-muted font-medium">Order ID</th>
                  <th className="text-left py-3 px-4 text-text-muted font-medium">Date</th>
                  <th className="text-left py-3 px-4 text-text-muted font-medium">Amount</th>
                  <th className="text-left py-3 px-4 text-text-muted font-medium">Method</th>
                  <th className="text-left py-3 px-4 text-text-muted font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-b border-text-muted/10">
                    <td className="py-3 px-4 text-text-primary font-medium">{payment.id}</td>
                    <td className="py-3 px-4 text-text-muted">{payment.orderId}</td>
                    <td className="py-3 px-4 text-text-muted">
                      {new Date(payment.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-text-primary font-semibold">
                      ฿{payment.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-text-muted">{payment.method}</td>
                    <td className="py-3 px-4">
                      <Badge variant={payment.status === "completed" ? "success" : "warning"}>
                        {payment.status}
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

import AdminNav from "@/components/layout/AdminNav";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { users } from "@/lib/mockData";

export default function AdminCustomersPage() {
  const customers = users.filter((u) => u.role === "customer");

  return (
    <div className="min-h-screen bg-background">
      <AdminNav />

      <div className="container-custom py-8">
        <h1 className="text-3xl font-bold text-text-primary mb-8">Customer Management</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="p-6">
            <h3 className="text-text-muted text-sm font-medium mb-2">Total Customers</h3>
            <p className="text-3xl font-bold text-text-primary">{customers.length}</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-text-muted text-sm font-medium mb-2">New This Month</h3>
            <p className="text-3xl font-bold text-primary">0</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-text-muted text-sm font-medium mb-2">Active Users</h3>
            <p className="text-3xl font-bold text-text-primary">{customers.length}</p>
          </Card>
        </div>

        <Card className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-text-muted/10">
                  <th className="text-left py-3 px-4 text-text-muted font-medium">Name</th>
                  <th className="text-left py-3 px-4 text-text-muted font-medium">Email</th>
                  <th className="text-left py-3 px-4 text-text-muted font-medium">Phone</th>
                  <th className="text-left py-3 px-4 text-text-muted font-medium">
                    Registered Date
                  </th>
                  <th className="text-left py-3 px-4 text-text-muted font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-b border-text-muted/10">
                    <td className="py-3 px-4 text-text-primary font-medium">{customer.name}</td>
                    <td className="py-3 px-4 text-text-muted">{customer.email}</td>
                    <td className="py-3 px-4 text-text-muted">{customer.phone}</td>
                    <td className="py-3 px-4 text-text-muted">
                      {new Date(customer.registeredDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-sm text-primary hover:underline">
                        View Details
                      </button>
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

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    try {
        const [orders, products] = await Promise.all([
            Order.find().sort({ createdAt: -1 }),
            Product.find().select('name categoryName price salePrice stock rating reviewCount isOnSale isFeatured sold'),
        ]);

        // Order statistics
        const totalRevenue = orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
        const totalOrders = orders.length;
        const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
        const deliveredOrders = orders.filter((o: any) => o.status === 'delivered').length;
        const cancelledOrders = orders.filter((o: any) => o.status === 'cancelled').length;
        const paidOrders = orders.filter((o: any) => o.status === 'paid').length;
        const shippedOrders = orders.filter((o: any) => o.status === 'shipped').length;
        const processingOrders = orders.filter((o: any) => o.status === 'processing').length;
        const pendingOrders = orders.filter((o: any) => o.status === 'pending_payment').length;

        // Product statistics
        const totalProducts = products.length;
        const totalStock = products.reduce((sum: number, p: any) => sum + (p.stock || 0), 0);
        const avgRating = totalProducts > 0
            ? (products.reduce((sum: number, p: any) => sum + (p.rating || 0), 0) / totalProducts).toFixed(1)
            : '0.0';
        const onSaleProducts = products.filter((p: any) => p.isOnSale).length;
        const featuredProducts = products.filter((p: any) => p.isFeatured).length;

        // Category distribution
        const categoryMap: Record<string, number> = {};
        products.forEach((p: any) => {
            const cat = p.categoryName || 'อื่นๆ';
            categoryMap[cat] = (categoryMap[cat] || 0) + 1;
        });

        // Orders for CSV export
        const ordersForExport = orders.map((o: any) => ({
            orderNumber: o.orderNumber,
            customer: o.shippingAddress?.name || 'N/A',
            items: o.items?.length || 0,
            total: o.total,
            status: o.status,
            date: o.createdAt,
        }));

        const productsForExport = products.map((p: any) => ({
            name: p.name,
            category: p.categoryName,
            price: p.price,
            salePrice: p.salePrice || '',
            stock: p.stock,
            rating: p.rating,
            reviewCount: p.reviewCount,
        }));

        return NextResponse.json({
            orderStats: {
                totalRevenue,
                totalOrders,
                averageOrderValue,
                deliveredOrders,
                cancelledOrders,
                paidOrders,
                shippedOrders,
                processingOrders,
                pendingOrders,
            },
            productStats: {
                totalProducts,
                totalStock,
                avgRating,
                onSaleProducts,
                featuredProducts,
                avgPrice: totalProducts > 0
                    ? Math.round(products.reduce((sum: number, p: any) => sum + (p.price || 0), 0) / totalProducts)
                    : 0,
                saleProducts: products.filter((p: any) => p.salePrice && p.salePrice < p.price).length,
            },
            categories: categoryMap,
            ordersForExport,
            productsForExport,
        });
    } catch (error) {
        console.error('Reports data error:', error);
        return NextResponse.json({ error: 'Failed to fetch report data' }, { status: 500 });
    }
}

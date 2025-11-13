import React, { useState, useMemo } from 'react';
import { Sale, Product } from '../types';
import BarChart from './BarChart';

interface ReportsProps {
    sales: Sale[];
    products: Product[];
}

type Period = 'day' | 'week' | 'month';

const Reports: React.FC<ReportsProps> = ({ sales, products }) => {
    const [period, setPeriod] = useState<Period>('day');

    const filteredSales = useMemo(() => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        if (period === 'day') {
            return sales.filter(sale => new Date(sale.date) >= today);
        }
        if (period === 'week') {
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay());
            return sales.filter(sale => new Date(sale.date) >= startOfWeek);
        }
        if (period === 'month') {
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            return sales.filter(sale => new Date(sale.date) >= startOfMonth);
        }
        return [];
    }, [sales, period]);

    const stats = useMemo(() => {
        return filteredSales.reduce((acc, sale) => {
            acc.totalRevenue += sale.total;
            acc.totalProfit += sale.totalProfit;
            acc.totalSales += 1;
            return acc;
        }, { totalRevenue: 0, totalProfit: 0, totalSales: 0 });
    }, [filteredSales]);

    const chartData = useMemo(() => {
        const data: { [key: string]: { revenue: number; profit: number } } = {};
        filteredSales.forEach(sale => {
            const date = new Date(sale.date).toLocaleDateString('th-TH');
            if (!data[date]) {
                data[date] = { revenue: 0, profit: 0 };
            }
            data[date].revenue += sale.total;
            data[date].profit += sale.totalProfit;
        });

        const labels = Object.keys(data).sort((a,b) => new Date(a.split('/').reverse().join('-')).getTime() - new Date(b.split('/').reverse().join('-')).getTime());
        return {
            labels,
            datasets: [
                {
                    label: 'ยอดขาย',
                    data: labels.map(label => data[label].revenue),
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                },
                {
                    label: 'กำไร',
                    data: labels.map(label => data[label].profit),
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                }
            ]
        };
    }, [filteredSales]);

    const topProfitProducts = useMemo(() => {
        const productProfits: { [key: string]: { name: string, totalProfit: number } } = {};

        filteredSales.forEach(sale => {
            sale.items.forEach(item => {
                const profit = (item.price - item.costPrice) * item.quantity;
                if (!productProfits[item.productId]) {
                    productProfits[item.productId] = { name: item.name, totalProfit: 0 };
                }
                productProfits[item.productId].totalProfit += profit;
            });
        });

        return Object.values(productProfits)
            .sort((a, b) => b.totalProfit - a.totalProfit)
            .slice(0, 5);
    }, [filteredSales]);

    const StatCard: React.FC<{ title: string; value: string; color: string }> = ({ title, value, color }) => (
        <div className={`p-6 rounded-lg shadow-lg ${color}`}>
            <h3 className="text-lg font-medium text-white opacity-90">{title}</h3>
            <p className="text-3xl font-bold text-white mt-2">{value}</p>
        </div>
    );

    const periodButtons: { key: Period, label: string }[] = [
        { key: 'day', label: 'วันนี้' },
        { key: 'week', label: 'สัปดาห์นี้' },
        { key: 'month', label: 'เดือนนี้' }
    ];

    return (
        <div className="h-full flex flex-col">
            <div className="flex-shrink-0 flex flex-col sm:flex-row justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-700 dark:text-gray-300">รายงานสรุปผล</h2>
                <div className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 p-1 rounded-lg mt-4 sm:mt-0">
                    {periodButtons.map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => setPeriod(key)}
                            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
                                period === key
                                    ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-grow overflow-y-auto space-y-8 pt-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard title="ยอดขายรวม" value={`${stats.totalRevenue.toLocaleString()} ฿`} color="bg-blue-500" />
                    <StatCard title="กำไรรวม" value={`${stats.totalProfit.toLocaleString()} ฿`} color={stats.totalProfit >= 0 ? 'bg-green-500' : 'bg-red-500'} />
                    <StatCard title="จำนวนบิล" value={stats.totalSales.toLocaleString()} color="bg-indigo-500" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-bold mb-4">ยอดขายเทียบกับกำไร</h3>
                        {filteredSales.length > 0 ? (
                            <BarChart data={chartData} />
                        ) : (
                            <p className="text-center text-gray-500 dark:text-gray-400 py-16">ไม่มีข้อมูลการขายในช่วงเวลานี้</p>
                        )}
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-bold mb-4">5 อันดับสินค้าทำกำไรสูงสุด</h3>
                        {topProfitProducts.length > 0 ? (
                            <ul className="space-y-4">
                                {topProfitProducts.map((p, index) => (
                                    <li key={index} className="flex justify-between items-center text-sm">
                                        <span className="font-medium">{index + 1}. {p.name}</span>
                                        <span className="font-bold text-green-600 dark:text-green-400">+{p.totalProfit.toLocaleString()} ฿</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                             <p className="text-center text-gray-500 dark:text-gray-400 pt-16">ไม่มีข้อมูล</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
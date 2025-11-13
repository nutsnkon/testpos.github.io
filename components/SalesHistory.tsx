import React, { useState } from 'react';
import { Sale } from '../types';
import Modal from './Modal';
import { ViewIcon } from './icons';

interface SalesHistoryProps {
    sales: Sale[];
}

const SalesHistory: React.FC<SalesHistoryProps> = ({ sales }) => {
    const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

    return (
        <div className="h-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col">
            <h2 className="flex-shrink-0 text-2xl font-bold mb-6 text-gray-700 dark:text-gray-300">ประวัติการขาย</h2>
            <div className="flex-grow overflow-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="sticky top-0 bg-gray-50 dark:bg-gray-700 z-10">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">รหัสการขาย</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">วันที่</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">รายการสินค้า</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ยอดรวม</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">กำไร</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ดูรายละเอียด</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {sales.map(sale => {
                            const profitColor = sale.totalProfit > 0 ? 'text-green-600 dark:text-green-400' : sale.totalProfit < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400';
                            return (
                                <tr key={sale.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{sale.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(sale.date).toLocaleString('th-TH')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {sale.items.length} รายการ
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">{sale.total.toLocaleString()} ฿</td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${profitColor}`}>{sale.totalProfit.toLocaleString()} ฿</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => setSelectedSale(sale)} className="text-blue-600 hover:text-blue-900"><ViewIcon /></button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {selectedSale && (
                <Modal title={`รายละเอียดการขาย #${selectedSale.id}`} onClose={() => setSelectedSale(null)}>
                    <div className="space-y-2">
                        {selectedSale.items.map(item => (
                            <div key={item.productId} className="flex items-start justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                                <div className="flex-grow">
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.productCode}</p>
                                </div>
                                <div className='text-right'>
                                    <p className="font-semibold text-sm">{(item.quantity * item.price).toLocaleString()} ฿</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {item.quantity} x {item.price.toLocaleString()} ฿
                                    </p>
                                </div>
                            </div>
                        ))}
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 space-y-2 text-sm">
                             <div className="flex justify-between">
                                <span>ยอดรวม:</span>
                                <span>{selectedSale.total.toLocaleString()} ฿</span>
                            </div>
                             <div className="flex justify-between">
                                <span>ต้นทุนรวม:</span>
                                <span>{selectedSale.totalCost.toLocaleString()} ฿</span>
                            </div>
                            <div className={`flex justify-between text-base font-bold ${selectedSale.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                <span>กำไร:</span>
                                <span>{selectedSale.totalProfit.toLocaleString()} ฿</span>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default SalesHistory;
import React, { useState } from 'react';
import { Sale, Product } from '../types.ts';
import Modal from './Modal.tsx';
import { ViewIcon } from './icons.tsx';

interface SalesHistoryProps {
    sales: Sale[];
    products: Product[];
}

const SalesHistory: React.FC<SalesHistoryProps> = ({ sales, products }) => {
    const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-700 dark:text-gray-300">ประวัติการขาย</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">รหัสการขาย</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">วันที่</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">รายการสินค้า</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ยอดรวม</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ดูรายละเอียด</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {sales.map(sale => (
                            <tr key={sale.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{sale.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(sale.date).toLocaleString('th-TH')}</td>
                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                    {sale.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">{sale.total.toLocaleString()} ฿</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => setSelectedSale(sale)} className="text-blue-600 hover:text-blue-900"><ViewIcon /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedSale && (
                <Modal title={`รายละเอียดการขาย #${selectedSale.id}`} onClose={() => setSelectedSale(null)}>
                    <div className="space-y-4">
                        {selectedSale.items.map(item => (
                            <div key={item.productId} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="flex-grow">
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {item.quantity} x {item.price.toLocaleString()} ฿
                                    </p>
                                </div>
                                <p className="font-semibold">{(item.quantity * item.price).toLocaleString()} ฿</p>
                            </div>
                        ))}
                        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600 flex justify-between text-lg font-bold">
                            <span>ยอดรวม:</span>
                            <span>{selectedSale.total.toLocaleString()} ฿</span>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default SalesHistory;
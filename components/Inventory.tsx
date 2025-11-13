import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import Modal from './Modal';
import { PlusIcon, AlertIcon } from './icons';

interface InventoryProps {
    products: Product[];
    addStock: (productId: string, quantity: number) => void;
    lowStockThreshold: number;
}

const AddStockForm: React.FC<{
    onSave: (quantity: number) => void;
    onClose: () => void;
}> = ({ onSave, onClose }) => {
    const [quantity, setQuantity] = useState(1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(Number(quantity));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">จำนวนที่เพิ่ม</label>
                <input
                    type="number"
                    value={quantity}
                    onChange={e => setQuantity(Number(e.target.value))}
                    required
                    min="1"
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">ยกเลิก</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">เพิ่มสต็อก</button>
            </div>
        </form>
    );
};


const Inventory: React.FC<InventoryProps> = ({ products, addStock, lowStockThreshold }) => {
    const [stockingProduct, setStockingProduct] = useState<Product | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const lowStockProducts = useMemo(() => 
        products
            .filter(p => p.stock <= lowStockThreshold)
            .sort((a, b) => a.stock - b.stock),
    [products, lowStockThreshold]);

    const handleAddStock = (quantity: number) => {
        if (stockingProduct) {
            addStock(stockingProduct.id, quantity);
        }
        setStockingProduct(null);
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col">
            <div className="flex-shrink-0 flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">จัดการสต็อกสินค้า</h2>
                <div className="relative w-full sm:w-72">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </span>
                    <input
                        type="text"
                        placeholder="ค้นหาสินค้า..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    />
                </div>
            </div>

            {lowStockProducts.length > 0 && (
                <div className="flex-shrink-0 mb-6 p-4 border-l-4 border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 rounded-r-lg">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <AlertIcon />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                สินค้าใกล้หมดสต็อก ({lowStockProducts.length} รายการ)
                            </h3>
                            <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                                <ul className="list-disc space-y-1 pl-5">
                                    {lowStockProducts.map(p => (
                                        <li key={p.id}>
                                            {p.name} - <span className="font-bold">เหลือ {p.stock} ชิ้น</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex-grow overflow-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="sticky top-0 bg-gray-50 dark:bg-gray-700 z-10">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">สินค้า</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">สต็อกคงเหลือ</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredProducts.map(product => (
                            <tr key={product.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium">{product.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        product.stock > 10 ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 
                                        product.stock > 0 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                                    }`}>
                                        {product.stock} ชิ้น
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => setStockingProduct(product)} className="flex items-center gap-2 px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-xs ml-auto">
                                        <PlusIcon />
                                        เพิ่มสต็อก
                                    </button>
                                </td>
                            </tr>
                        ))}
                         {filteredProducts.length === 0 && (
                            <tr>
                                <td colSpan={3} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                                    {products.length > 0 ? 'ไม่พบสินค้าที่ค้นหา' : 'ยังไม่มีสินค้าในระบบ'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {stockingProduct && (
                <Modal title={`เพิ่มสต็อกสำหรับ ${stockingProduct.name}`} onClose={() => setStockingProduct(null)}>
                    <AddStockForm onSave={handleAddStock} onClose={() => setStockingProduct(null)} />
                </Modal>
            )}
        </div>
    );
};

export default Inventory;
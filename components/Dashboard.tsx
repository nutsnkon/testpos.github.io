import React, { useState } from 'react';
import { Product, CartItem, Sale } from '../types';
import { PlusIcon, MinusIcon, TrashIcon } from './icons';
import Receipt from './Receipt';

interface DashboardProps {
    products: Product[];
    processSale: () => Sale | null;
    lowStockThreshold: number;
    cart: CartItem[];
    addToCart: (product: Product) => void;
    setItemQuantity: (productId: string, quantity: number) => void;
    removeFromCart: (productId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ products, processSale, lowStockThreshold, cart, addToCart, setItemQuantity, removeFromCart }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [lastSale, setLastSale] = useState<Sale | null>(null);
    
    const handleSetItemQuantity = (productId: string, value: string) => {
         if (value === '') {
            setItemQuantity(productId, 0); 
            return;
        }
        
        const newQuantity = parseInt(value, 10);
        if (!isNaN(newQuantity)) {
            setItemQuantity(productId, newQuantity);
        }
    };

    const handleQuantityInputBlur = (productId: string) => {
        const itemInCart = cart.find(item => item.productId === productId);
        if (itemInCart && itemInCart.quantity <= 0) {
            removeFromCart(productId);
        }
    };

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleCheckout = () => {
        if(cart.length === 0) return;
        const sale = processSale();
        if(sale) {
            setLastSale(sale);
        }
    };
    
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 flex flex-col h-full min-h-0">
                    <div className="flex-shrink-0 flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">รายการสินค้า</h2>
                        <div className="relative w-full sm:w-72">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </span>
                            <input
                                type="text"
                                placeholder="ค้นหาสินค้า, รหัสสินค้า..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                            />
                        </div>
                    </div>
                    <div className="flex-grow overflow-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="sticky top-0 bg-gray-50 dark:bg-gray-700 z-10">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">รหัสสินค้า</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">สินค้า</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ราคา</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">สต็อก</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredProducts.map(product => {
                                    const canAddToCart = product.stock > 0;
                                    const isLowStock = canAddToCart && product.stock <= lowStockThreshold;
                                    return (
                                        <tr key={product.id} className={!canAddToCart ? 'opacity-50' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{product.code}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{product.price.toLocaleString()} ฿</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                <span className={isLowStock ? 'font-bold text-yellow-600 dark:text-yellow-400' : ''}>
                                                    {product.stock}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => canAddToCart && addToCart(product)}
                                                    disabled={!canAddToCart}
                                                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs disabled:bg-gray-400 disabled:cursor-not-allowed"
                                                >
                                                    <PlusIcon />
                                                    <span>เพิ่ม</span>
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                                {filteredProducts.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                                            {products.length > 0 ? 'ไม่พบสินค้าที่ค้นหา' : 'ยังไม่มีสินค้าในระบบ'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col h-full min-h-0">
                    <h2 className="text-2xl font-bold mb-4 text-gray-700 dark:text-gray-300">ตะกร้าสินค้า</h2>
                    <div className="flex-grow overflow-y-auto pr-2">
                        {cart.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400 text-center mt-10">ยังไม่มีสินค้าในตะกร้า</p>
                        ) : (
                            <div className="space-y-4">
                                {cart.map(item => (
                                    <div key={item.productId} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <div className="flex-grow">
                                            <p className="font-semibold">{item.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{item.productCode}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.price.toLocaleString()} ฿</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => setItemQuantity(item.productId, item.quantity - 1)} className="p-1 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500"><MinusIcon /></button>
                                            <input
                                                type="number"
                                                aria-label={`Quantity for ${item.name}`}
                                                className="w-12 text-center font-semibold bg-gray-100 dark:bg-gray-600 rounded-md border border-gray-300 dark:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 py-0.5"
                                                value={item.quantity === 0 ? '' : item.quantity}
                                                onChange={e => handleSetItemQuantity(item.productId, e.target.value)}
                                                onBlur={() => handleQuantityInputBlur(item.productId)}
                                                min="0"
                                            />
                                            <button onClick={() => setItemQuantity(item.productId, item.quantity + 1)} className="p-1 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500"><PlusIcon /></button>
                                        </div>
                                        <button onClick={() => removeFromCart(item.productId)} className="ml-4 text-red-500 hover:text-red-700">
                                            <TrashIcon />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {cart.length > 0 && (
                        <div className="flex-shrink-0 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between text-xl font-bold">
                                <span>ยอดรวม:</span>
                                <span>{total.toLocaleString()} ฿</span>
                            </div>
                            <button 
                                onClick={handleCheckout} 
                                className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors duration-300 disabled:bg-gray-400"
                                disabled={cart.length === 0}
                            >
                                ชำระเงิน
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {lastSale && (
                <Receipt sale={lastSale} onClose={() => setLastSale(null)} />
            )}
        </>
    );
};

export default Dashboard;
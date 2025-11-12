
import React, { useState } from 'react';
import { Product, CartItem, Sale } from '../types.ts';
import { PlusIcon, MinusIcon, TrashIcon } from './icons.tsx';
import Receipt from './Receipt.tsx';

interface DashboardProps {
    products: Product[];
    processSale: (cart: CartItem[]) => Sale;
}

const Dashboard: React.FC<DashboardProps> = ({ products, processSale }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [lastSale, setLastSale] = useState<Sale | null>(null);

    const addToCart = (product: Product) => {
        const existingItem = cart.find(item => item.productId === product.id);
        const productInStock = products.find(p => p.id === product.id);

        if (existingItem) {
            if (productInStock && existingItem.quantity < productInStock.stock) {
                setCart(cart.map(item => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item));
            }
        } else {
            if(productInStock && productInStock.stock > 0){
                 setCart([...cart, { productId: product.id, name: product.name, price: product.price, quantity: 1 }]);
            }
        }
    };

    const setItemQuantity = (productId: string, value: string | number) => {
        const productInStock = products.find(p => p.id === productId);
        if (!productInStock) return;
    
        let newQuantity: number;
        if (typeof value === 'string') {
            if (value === '') {
                newQuantity = 0; // Allow clearing the input, treat as 0 temporarily
            } else {
                newQuantity = parseInt(value, 10);
                if (isNaN(newQuantity)) return; // Ignore invalid characters like 'e'
            }
        } else {
            newQuantity = value;
        }
    
        const cappedQuantity = Math.min(newQuantity, productInStock.stock);
        setCart(cart.map(item =>
            item.productId === productId
                ? { ...item, quantity: cappedQuantity < 0 ? 0 : cappedQuantity }
                : item
        ));
    };

    const handleQuantityInputBlur = (productId: string) => {
        const itemInCart = cart.find(item => item.productId === productId);
        if (itemInCart && itemInCart.quantity <= 0) {
            removeFromCart(productId);
        }
    };
    
    const removeFromCart = (productId: string) => {
        setCart(cart.filter(item => item.productId !== productId));
    };

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleCheckout = () => {
        if(cart.length === 0) return;
        const sale = processSale(cart);
        setLastSale(sale);
        setCart([]);
    };
    
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">รายการสินค้า</h2>
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
                    <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">สินค้า</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ราคา</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">สต็อก</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredProducts.map(product => {
                                    const canAddToCart = product.stock > 0;
                                    return (
                                        <tr key={product.id} className={!canAddToCart ? 'opacity-50' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{product.price.toLocaleString()} ฿</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{product.stock}</td>
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
                                        <td colSpan={4} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                                            {products.length > 0 ? 'ไม่พบสินค้าที่ค้นหา' : 'ยังไม่มีสินค้าในระบบ'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col h-full max-h-[85vh]">
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
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{item.price.toLocaleString()} ฿</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => setItemQuantity(item.productId, item.quantity - 1)} className="p-1 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500"><MinusIcon /></button>
                                            <input
                                                type="number"
                                                aria-label={`Quantity for ${item.name}`}
                                                className="w-12 text-center font-semibold bg-gray-100 dark:bg-gray-600 rounded-md border border-gray-300 dark:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 py-0.5"
                                                value={item.quantity === 0 ? '' : item.quantity}
                                                onChange={e => setItemQuantity(item.productId, e.target.value)}
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
                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
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
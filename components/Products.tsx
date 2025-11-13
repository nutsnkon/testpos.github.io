import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import Modal from './Modal';
import { EditIcon, TrashIcon, PlusIcon } from './icons';

interface ProductsProps {
    products: Product[];
    addProduct: (product: Omit<Product, 'id'>) => void;
    updateProduct: (product: Product) => void;
    deleteProduct: (productId: string) => void;
    lowStockThreshold: number;
}

const ProductForm: React.FC<{
    product?: Product | null;
    products: Product[];
    onSave: (product: Omit<Product, 'id'> | Product) => void;
    onClose: () => void;
}> = ({ product, products, onSave, onClose }) => {
    const [code, setCode] = useState(product?.code || '');
    const [name, setName] = useState(product?.name || '');
    const [costPrice, setCostPrice] = useState(product?.costPrice || 0);
    const [price, setPrice] = useState(product?.price || 0);
    const [stock, setStock] = useState(product?.stock || 0);
    const [codeError, setCodeError] = useState('');

    useEffect(() => {
        if (code) {
            const isDuplicate = products.some(p => 
                p.code.toLowerCase() === code.toLowerCase() && p.id !== product?.id
            );
            if (isDuplicate) {
                setCodeError('รหัสสินค้านี้มีอยู่แล้วในระบบ');
            } else {
                setCodeError('');
            }
        } else {
            setCodeError('');
        }
    }, [code, products, product]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (codeError) return;

        const newProductData = {
            code,
            name,
            costPrice: Number(costPrice),
            price: Number(price),
            stock: Number(stock),
        };

        if (product) {
            onSave({ ...product, ...newProductData });
        } else {
            onSave(newProductData);
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
             <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">รหัสสินค้า</label>
                <input type="text" value={code} onChange={e => setCode(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                {codeError && <p className="text-red-500 text-xs mt-1">{codeError}</p>}
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">ชื่อสินค้า</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">ราคาซื้อ (ทุน)</label>
                <input type="number" value={costPrice} onChange={e => setCostPrice(Number(e.target.value))} required min="0" step="any" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">ราคาขาย</label>
                <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} required min="0" step="any" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">จำนวนในสต็อก</label>
                <input type="number" value={stock} onChange={e => setStock(Number(e.target.value))} required min="0" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">ยกเลิก</button>
                <button type="submit" disabled={!!codeError} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed">บันทึก</button>
            </div>
        </form>
    );
};


const Products: React.FC<ProductsProps> = ({ products, addProduct, updateProduct, deleteProduct, lowStockThreshold }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleOpenAddModal = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleSaveProduct = (productData: Omit<Product, 'id'> | Product) => {
        if ('id' in productData) {
            updateProduct(productData);
        } else {
            addProduct(productData);
        }
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const confirmDelete = (productId: string) => {
        deleteProduct(productId);
        setDeletingProductId(null);
    }
    
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col">
            <div className="flex-shrink-0 flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">จัดการสินค้า</h2>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                     <div className="relative w-full sm:w-64">
                         <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </span>
                        <input
                            type="text"
                            placeholder="ค้นหาสินค้า, รหัส..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                        />
                    </div>
                    <button onClick={handleOpenAddModal} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex-shrink-0">
                        <PlusIcon />
                        <span>เพิ่มสินค้า</span>
                    </button>
                </div>
            </div>
            <div className="flex-grow overflow-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="sticky top-0 bg-gray-50 dark:bg-gray-700 z-10">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">รหัส</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">สินค้า</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ราคาซื้อ</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ราคาขาย</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">กำไร</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">สต็อก</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredProducts.map(product => {
                            const costPrice = product.costPrice || 0;
                            const profit = product.price - costPrice;
                            const profitColor = profit > 0 ? 'text-green-600 dark:text-green-400' : profit < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400';
                            const isLowStock = product.stock > 0 && product.stock <= lowStockThreshold;

                            return (
                                <tr key={product.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{product.code}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium">{product.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{costPrice.toLocaleString()} ฿</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{product.price.toLocaleString()} ฿</td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${profitColor}`}>{profit.toLocaleString()} ฿</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={isLowStock ? 'font-bold text-yellow-600 dark:text-yellow-400' : ''}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleOpenEditModal(product)} className="text-blue-600 hover:text-blue-900 mr-4"><EditIcon /></button>
                                        <button onClick={() => setDeletingProductId(product.id)} className="text-red-600 hover:text-red-900"><TrashIcon /></button>
                                    </td>
                                </tr>
                            );
                        })}
                         {filteredProducts.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                                    {products.length > 0 ? 'ไม่พบสินค้าที่ค้นหา' : 'ยังไม่มีสินค้าในระบบ'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <Modal title={editingProduct ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'} onClose={() => setIsModalOpen(false)}>
                    <ProductForm 
                        product={editingProduct} 
                        products={products}
                        onSave={handleSaveProduct} 
                        onClose={() => setIsModalOpen(false)} 
                    />
                </Modal>
            )}

            {deletingProductId && (
                <Modal title="ยืนยันการลบ" onClose={() => setDeletingProductId(null)}>
                    <p>คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้?</p>
                    <div className="flex justify-end gap-3 pt-4">
                        <button onClick={() => setDeletingProductId(null)} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">ยกเลิก</button>
                        <button onClick={() => confirmDelete(deletingProductId)} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">ลบ</button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Products;
import React, { useState, useCallback } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage.ts';
import { Product, Sale, CartItem, View } from './types.ts';
import Navbar from './components/Navbar.tsx';
import Dashboard from './components/Dashboard.tsx';
import Products from './components/Products.tsx';
import Inventory from './components/Inventory.tsx';
import SalesHistory from './components/SalesHistory.tsx';

const initialProducts: Product[] = [
    { id: 'p1', name: 'หมูปิ้ง', price: 10, stock: 100 },
    { id: 'p2', name: 'ไก่ปิ้ง', price: 10, stock: 80 },
    { id: 'p3', name: 'ข้าวเหนียว', price: 5, stock: 200 },
    { id: 'p4', name: 'น้ำจิ้มแจ่ว', price: 5, stock: 50 },
    { id: 'p5', name: 'โค้ก', price: 15, stock: 60 },
    { id: 'p6', name: 'น้ำเปล่า', price: 10, stock: 120 },
];


const App: React.FC = () => {
    const [view, setView] = useState<View>('dashboard');
    const [products, setProducts] = useLocalStorage<Product[]>('pos-products', initialProducts);
    const [sales, setSales] = useLocalStorage<Sale[]>('pos-sales', []);

    const addProduct = useCallback((productData: Omit<Product, 'id'>) => {
        const newProduct: Product = {
            ...productData,
            id: new Date().toISOString(),
        };
        setProducts(prev => [...prev, newProduct]);
    }, [setProducts]);

    const updateProduct = useCallback((updatedProduct: Product) => {
        setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    }, [setProducts]);

    const deleteProduct = useCallback((productId: string) => {
        setProducts(prev => prev.filter(p => p.id !== productId));
    }, [setProducts]);

    const addStock = useCallback((productId: string, quantity: number) => {
        setProducts(prev => prev.map(p =>
            p.id === productId ? { ...p, stock: p.stock + quantity } : p
        ));
    }, [setProducts]);

    const processSale = useCallback((cart: CartItem[]): Sale => {
        // 1. Update stock
        setProducts(prevProducts => {
            const updatedProducts = [...prevProducts];
            cart.forEach(item => {
                const productIndex = updatedProducts.findIndex(p => p.id === item.productId);
                if (productIndex !== -1) {
                    updatedProducts[productIndex].stock -= item.quantity;
                }
            });
            return updatedProducts;
        });
        
        // 2. Create sale record with formatted ID
        const now = new Date();
        const saleId = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;

        const newSale: Sale = {
            id: saleId,
            items: cart,
            total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
            date: now.toISOString(),
        };
        setSales(prevSales => [newSale, ...prevSales]);
        return newSale;
    }, [setProducts, setSales]);

    const renderView = () => {
        switch (view) {
            case 'dashboard':
                return <Dashboard products={products} processSale={processSale} />;
            case 'products':
                return <Products products={products} addProduct={addProduct} updateProduct={updateProduct} deleteProduct={deleteProduct} />;
            case 'inventory':
                return <Inventory products={products} addStock={addStock} />;
            case 'sales':
                return <SalesHistory sales={sales} products={products} />;
            default:
                return <Dashboard products={products} processSale={processSale} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <Navbar currentView={view} setView={setView} />
            <main className="p-4 sm:p-6 lg:p-8">
                {renderView()}
            </main>
        </div>
    );
};

export default App;
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Product, Sale, CartItem, View } from './types';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Products from './components/Products';
import Inventory from './components/Inventory';
import SalesHistory from './components/SalesHistory';
import Reports from './components/Reports';

const initialProducts: Product[] = [
    { id: 'prod-1', code: 'MT-001', name: 'ปูนซีเมนต์ TPI (ปอร์ตแลนด์)', costPrice: 110, price: 130, stock: 100 },
    { id: 'prod-2', code: 'MT-002', name: 'ทรายหยาบ (ถุง)', costPrice: 30, price: 45, stock: 200 },
    { id: 'prod-3', code: 'MT-003', name: 'ทรายละเอียด (ถุง)', costPrice: 35, price: 50, stock: 200 },
    { id: 'prod-4', code: 'MT-004', name: 'หินคลุก (ถุง)', costPrice: 30, price: 45, stock: 150 },
    { id: 'prod-5', code: 'MT-005', name: 'อิฐมอญ', costPrice: 1.5, price: 2.5, stock: 5000 },
    { id: 'prod-6', code: 'MT-006', name: 'อิฐมวลเบา G4', costPrice: 18, price: 25, stock: 1000 },
    { id: 'prod-7', code: 'MT-007', name: 'เหล็กเส้นกลม 6 มม.', costPrice: 85, price: 105, stock: 300 },
    { id: 'prod-8', code: 'MT-008', name: 'เหล็กข้ออ้อย 12 มม.', costPrice: 350, price: 420, stock: 150 },
    { id: 'prod-9', code: 'MT-009', name: 'กระเบื้องหลังคาลอนคู่ (แผ่น)', costPrice: 55, price: 70, stock: 500 },
    { id: 'prod-10', code: 'MT-010', name: 'สีทาภายใน TOA 4Seasons (แกลลอน)', costPrice: 450, price: 550, stock: 50 },
    { id: 'prod-11', code: 'MT-011', name: 'สีทาภายนอก TOA SuperShield (แกลลอน)', costPrice: 950, price: 1100, stock: 40 },
    { id: 'prod-12', code: 'MT-012', name: 'แปรงทาสี 3 นิ้ว', costPrice: 40, price: 60, stock: 120 },
    { id: 'prod-13', code: 'MT-013', name: 'ลูกกลิ้งทาสี 10 นิ้ว', costPrice: 80, price: 110, stock: 80 },
    { id: 'prod-14', code: 'MT-014', name: 'ทินเนอร์ AAA (ปี๊บ)', costPrice: 300, price: 380, stock: 30 },
    { id: 'prod-15', code: 'MT-015', name: 'ประตูไม้เนื้อแข็ง 80x200 ซม.', costPrice: 1500, price: 1900, stock: 20 },
    { id: 'prod-16', code: 'MT-016', name: 'หน้าต่างอลูมิเนียมบานเลื่อน 100x110 ซม.', costPrice: 1200, price: 1550, stock: 25 },
    { id: 'prod-17', code: 'MT-017', name: 'วงกบประตูไม้สังเคราะห์', costPrice: 600, price: 750, stock: 30 },
    { id: 'prod-18', code: 'MT-018', name: 'ลูกบิดประตู (สแตนเลส)', costPrice: 250, price: 350, stock: 60 },
    { id: 'prod-19', code: 'MT-019', name: 'ท่อ PVC 4 หุน (เส้น)', costPrice: 45, price: 60, stock: 400 },
    { id: 'prod-20', code: 'MT-020', name: 'ข้อต่อตรง PVC 4 หุน', costPrice: 3, price: 5, stock: 1000 },
    { id: 'prod-21', code: 'MT-021', name: 'กาวทาท่อ PVC (กระป๋องเล็ก)', costPrice: 25, price: 40, stock: 150 },
    { id: 'prod-22', code: 'MT-022', name: 'สายไฟ VAF 2x2.5 (เมตร)', costPrice: 18, price: 25, stock: 5000 },
    { id: 'prod-23', code: 'MT-023', name: 'ปลั๊กไฟคู่มีกราวด์', costPrice: 45, price: 65, stock: 200 },
    { id: 'prod-24', code: 'MT-024', name: 'สวิตช์ไฟทางเดียว', costPrice: 30, price: 45, stock: 250 },
    { id: 'prod-25', code: 'MT-025', name: 'หลอดไฟ LED 9W', costPrice: 50, price: 75, stock: 300 },
    { id: 'prod-26', code: 'MT-026', name: 'กระเบื้องปูพื้น 60x60 ซม. (กล่อง)', costPrice: 220, price: 280, stock: 80 },
    { id: 'prod-27', code: 'MT-027', name: 'ยาแนว (ถุง)', costPrice: 20, price: 35, stock: 150 },
    { id: 'prod-28', code: 'MT-028', name: 'สกรูเกลียวปล่อย (กล่อง 100 ตัว)', costPrice: 40, price: 60, stock: 100 },
    { id: 'prod-29', code: 'MT-029', name: 'ตะปู 2 นิ้ว (กก.)', costPrice: 45, price: 60, stock: 50 },
    { id: 'prod-30', code: 'MT-030', name: 'ค้อนหงอน', costPrice: 150, price: 220, stock: 40 },
];

const LOW_STOCK_THRESHOLD = 10;

const App: React.FC = () => {
    const [view, setView] = useState<View>('dashboard');
    const [products, setProducts] = useLocalStorage<Product[]>('pos-products', initialProducts);
    const [sales, setSales] = useLocalStorage<Sale[]>('pos-sales', []);
    const [cart, setCart] = useState<CartItem[]>([]);

    const lowStockCount = useMemo(() => 
        products.filter(p => p.stock <= LOW_STOCK_THRESHOLD).length, 
    [products]);

    const addProduct = useCallback((productData: Omit<Product, 'id'>) => {
        const newProduct: Product = {
            id: `prod-${Date.now()}`,
            ...productData
        };
        setProducts(prev => [newProduct, ...prev].sort((a, b) => a.name.localeCompare(b.name)));
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

    const addToCart = useCallback((product: Product) => {
        setCart(currentCart => {
            const existingItem = currentCart.find(item => item.productId === product.id);
            const productInStock = products.find(p => p.id === product.id);

            if (existingItem) {
                if (productInStock && existingItem.quantity < productInStock.stock) {
                    return currentCart.map(item => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item);
                }
            } else {
                if (productInStock && productInStock.stock > 0) {
                    return [...currentCart, {
                        productId: product.id,
                        productCode: product.code,
                        name: product.name,
                        price: product.price,
                        costPrice: product.costPrice,
                        quantity: 1
                    }];
                }
            }
            return currentCart;
        });
    }, [products]);

    const setItemQuantity = useCallback((productId: string, quantity: number) => {
        const productInStock = products.find(p => p.id === productId);
        if (!productInStock) return;
        
        const cappedQuantity = Math.min(quantity, productInStock.stock);
        setCart(currentCart => currentCart.map(item =>
            item.productId === productId
                ? { ...item, quantity: cappedQuantity < 0 ? 0 : cappedQuantity }
                : item
        ).filter(item => item.quantity > 0));
    }, [products]);

    const removeFromCart = useCallback((productId: string) => {
        setCart(currentCart => currentCart.filter(item => item.productId !== productId));
    }, []);

    const processSale = useCallback((): Sale | null => {
        if (cart.length === 0) return null;
        
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const totalCost = cart.reduce((sum, item) => sum + (item.costPrice || 0) * item.quantity, 0);
        const totalProfit = total - totalCost;

        const newSale: Sale = {
            id: `sale-${Date.now()}`,
            items: cart,
            total,
            totalCost,
            totalProfit,
            date: new Date().toISOString(),
        };
        setSales(prevSales => [newSale, ...prevSales]);

        const updatedProducts = products.map(product => {
            const itemInCart = cart.find(item => item.productId === product.id);
            if (itemInCart) {
                return { ...product, stock: product.stock - itemInCart.quantity };
            }
            return product;
        });
        setProducts(updatedProducts);
        setCart([]);
        
        return newSale;
    }, [products, cart, setProducts, setSales]);

    useEffect(() => {
        let barcode = '';
        let timeoutId: ReturnType<typeof setTimeout> | null = null;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            if (timeoutId) {
                clearTimeout(timeoutId);
            }

            if (e.key === 'Enter') {
                if (barcode) {
                    const product = products.find(p => p.code.toLowerCase() === barcode.toLowerCase());
                    if (product) {
                        addToCart(product);
                        setView('dashboard');
                    }
                    barcode = '';
                }
                return;
            }

            if (e.key.length === 1) {
                barcode += e.key;
            }

            timeoutId = setTimeout(() => {
                barcode = '';
            }, 100);
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [products, addToCart]);

    const renderView = () => {
        switch (view) {
            case 'dashboard':
                return <Dashboard 
                            products={products} 
                            processSale={processSale} 
                            lowStockThreshold={LOW_STOCK_THRESHOLD}
                            cart={cart}
                            addToCart={addToCart}
                            setItemQuantity={setItemQuantity}
                            removeFromCart={removeFromCart}
                        />;
            case 'products':
                return <Products products={products} addProduct={addProduct} updateProduct={updateProduct} deleteProduct={deleteProduct} lowStockThreshold={LOW_STOCK_THRESHOLD} />;
            case 'inventory':
                return <Inventory products={products} addStock={addStock} lowStockThreshold={LOW_STOCK_THRESHOLD} />;
            case 'sales':
                return <SalesHistory sales={sales} />;
            case 'reports':
                return <Reports sales={sales} products={products} />;
            default:
                return <Dashboard 
                            products={products} 
                            processSale={processSale} 
                            lowStockThreshold={LOW_STOCK_THRESHOLD}
                            cart={cart}
                            addToCart={addToCart}
                            setItemQuantity={setItemQuantity}
                            removeFromCart={removeFromCart}
                        />;
        }
    };

    return (
        <div className="h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col overflow-hidden">
            <Navbar 
                currentView={view} 
                setView={setView} 
                lowStockCount={lowStockCount}
            />
            <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-hidden min-h-0">
                {renderView()}
            </main>
        </div>
    );
};

export default App;
export interface Product {
    id: string;
    code: string;
    name: string;
    price: number;
    stock: number;
    costPrice: number;
}

export interface CartItem {
    productId: string;
    productCode: string;
    name:string;
    price: number;
    costPrice: number;
    quantity: number;
}

export interface Sale {
    id: string;
    items: CartItem[];
    total: number;
    totalCost: number;
    totalProfit: number;
    date: string;
}

export type View = 'dashboard' | 'products' | 'inventory' | 'sales' | 'reports';
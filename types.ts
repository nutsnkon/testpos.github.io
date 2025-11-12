export interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
}

export interface CartItem {
    productId: string;
    name:string;
    price: number;
    quantity: number;
}

export interface Sale {
    id: string;
    items: CartItem[];
    total: number;
    date: string;
}

export type View = 'dashboard' | 'products' | 'inventory' | 'sales';
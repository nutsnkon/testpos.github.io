import React from 'react';
import { View } from '../types';
import { SaleIcon, ProductIcon, InventoryIcon, HistoryIcon, ReportIcon } from './icons';

interface NavbarProps {
    currentView: View;
    setView: (view: View) => void;
    lowStockCount: number;
}

const NavItem: React.FC<{
    label: string;
    view: View;
    currentView: View;
    setView: (view: View) => void;
    children: React.ReactNode;
    badgeCount?: number;
}> = ({ label, view, currentView, setView, children, badgeCount }) => {
    const isActive = currentView === view;
    return (
        <button
            onClick={() => setView(view)}
            className={`relative flex flex-col sm:flex-row items-center justify-center sm:justify-start w-full sm:w-auto px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
        >
            {children}
            <span className="mt-1 sm:mt-0 sm:ml-3">{label}</span>
            {badgeCount && badgeCount > 0 && (
                <span className="absolute -top-1 sm:top-1 sm:-right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                    {badgeCount}
                </span>
            )}
        </button>
    );
};

const Navbar: React.FC<NavbarProps> = ({ currentView, setView, lowStockCount }) => {
    return (
        <header className="bg-white dark:bg-gray-800 shadow-md">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row justify-between items-center py-4">
                    <div className="flex items-center mb-4 sm:mb-0">
                        <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                        <h1 className="ml-3 text-2xl font-bold text-gray-800 dark:text-white">ส เจริญวัสดุก่อสร้าง</h1>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <nav className="w-full sm:w-auto">
                            <div className="grid grid-cols-3 sm:flex gap-2">
                                 <NavItem label="หน้าขาย" view="dashboard" currentView={currentView} setView={setView}>
                                    <SaleIcon />
                                </NavItem>
                                <NavItem label="สินค้า" view="products" currentView={currentView} setView={setView}>
                                    <ProductIcon />
                                </NavItem>
                                <NavItem label="สต็อก" view="inventory" currentView={currentView} setView={setView} badgeCount={lowStockCount}>
                                    <InventoryIcon />
                                </NavItem>
                                <NavItem label="ประวัติการขาย" view="sales" currentView={currentView} setView={setView}>
                                    <HistoryIcon />
                                </NavItem>
                                <NavItem label="รายงาน" view="reports" currentView={currentView} setView={setView}>
                                    <ReportIcon />
                                </NavItem>
                            </div>
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
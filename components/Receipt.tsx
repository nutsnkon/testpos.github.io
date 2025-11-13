import React, { useEffect } from 'react';
import { Sale } from '../types';

interface ReceiptProps {
    sale: Sale;
    onClose: () => void;
}

const Receipt: React.FC<ReceiptProps> = ({ sale, onClose }) => {
    
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [onClose]);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 receipt-modal" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                
                <div className="flex-shrink-0 flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">ใบเสร็จรับเงิน</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 no-print">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <div className="flex-grow p-6 overflow-y-auto">
                    <div className="text-gray-800 dark:text-gray-200">
                        <div className="text-center mb-6">
                            <h2 className="text-xl font-bold">ส เจริญวัสดุก่อสร้าง</h2>
                            <p className="text-sm">ใบเสร็จรับเงิน/ใบกำกับภาษีอย่างย่อ</p>
                        </div>
                        <div className="mb-4 text-sm">
                            <p><strong>เลขที่ใบเสร็จ:</strong> {sale.id}</p>
                            <p><strong>วันที่:</strong> {new Date(sale.date).toLocaleString('th-TH')}</p>
                        </div>
                        <div className="border-t border-b border-dashed border-gray-400 dark:border-gray-600 py-2 mb-4">
                            <div className="grid grid-cols-12 text-sm font-semibold">
                               <div className="col-span-6">รายการ</div>
                               <div className="col-span-2 text-center">จำนวน</div>
                               <div className="col-span-2 text-right">ราคา</div>
                               <div className="col-span-2 text-right">รวม</div>
                            </div>
                             {sale.items.map(item => (
                                <div key={item.productId} className="grid grid-cols-12 text-sm my-1">
                                    <div className="col-span-6">
                                        {item.name}
                                        <span className="block text-xs text-gray-500">{item.productCode}</span>
                                    </div>
                                    <div className="col-span-2 text-center">{item.quantity}</div>
                                    <div className="col-span-2 text-right">{item.price.toLocaleString()}</div>
                                    <div className="col-span-2 text-right">{(item.price * item.quantity).toLocaleString()}</div>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-2 text-right font-semibold">
                             <div className="flex justify-between">
                                <span>รวมเป็นเงิน:</span>
                                <span>{sale.total.toLocaleString()} ฿</span>
                            </div>
                            <div className="flex justify-between text-xl">
                                <span>ยอดสุทธิ:</span>
                                <span>{sale.total.toLocaleString()} ฿</span>
                            </div>
                        </div>
                        <div className="text-center mt-6 text-sm">
                            <p>ขอบคุณที่ใช้บริการ</p>
                        </div>
                    </div>
                </div>
                
                <div className="flex-shrink-0 flex justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700 no-print">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">ปิด</button>
                    <button onClick={handlePrint} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">พิมพ์</button>
                </div>
            </div>
        </div>
    );
};

export default Receipt;
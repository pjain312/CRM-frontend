
import { useQuery } from "@tanstack/react-query";
import { Download, Printer } from "lucide-react";
import Logo from "../assets/Logo.png";
import { getPackageInvoiceData } from "../services/packages-service";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader
} from "./ui/dialog";

const PackageInvoice = ({ open ,onOpenChange, appointment }) => {

    const { data: invoiceData, isLoading } = useQuery({
        queryKey: ["package-invoice", appointment.PatientId, appointment.paymentTransactionId || appointment.AppointmentId],
        queryFn: () => getPackageInvoiceData({
            patientId: appointment.PatientId, 
            appointmentId: appointment.AppointmentId,
            paymentTransactionId: appointment.paymentTransactionId
        }),
        enabled: !!(appointment.PatientId && (appointment.paymentTransactionId || appointment.AppointmentId)),
      });

    const getPrintStyles = () => {
        return `
            @page {
                size: A4;
                margin: 0.5in;
            }
            * {
                box-sizing: border-box;
            }
            body {
                font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                margin: 0;
                padding: 0;
                color: #111827;
                background: white;
                line-height: 1.5;
            }
            .max-w-4xl {
                max-width: 896px;
                margin: 0 auto;
                padding: 32px;
            }
            .flex {
                display: flex;
            }
            .justify-between {
                justify-content: space-between;
            }
            .justify-start {
                justify-content: flex-start;
            }
            .text-right {
                text-align: right;
            }
            .leading-tight {
                line-height: 1.25;
            }
            .mb-0 {
                margin-bottom: 0;
            }
            .ml-2 {
                margin-left: 8px;
            }
            .text-gray-900 {
                color: #111827;
            }
            .items-start {
                align-items: flex-start;
            }
            .items-center {
                align-items: center;
            }
            .gap-3 {
                gap: 12px;
            }
            .gap-8 {
                gap: 32px;
            }
            .mb-4 {
                margin-bottom: 16px;
            }
            .mb-8 {
                margin-bottom: 32px;
            }
            .w-48 {
                width: 192px;
            }
            .w-80 {
                width: 256px;
            }
            .h-24 {
                height: 96px;
            }
            .h-32 {
                height: 128px;
            }
            .object-contain {
                object-fit: contain;
            }
            .font-bold {
                font-weight: 700;
            }
            .font-medium {
                font-weight: 500;
            }
            .font-semibold {
                font-weight: 600;
            }
            .text-lg {
                font-size: 18px;
                line-height: 1.4;
            }
            .text-2xl {
                font-size: 24px;
                line-height: 1.3;
            }
            .text-sm {
                font-size: 14px;
                line-height: 1.4;
            }
            .text-gray-600 {
                color: #4b5563;
            }
            .text-gray-900 {
                color: #111827;
            }
            .text-center {
                text-align: center;
            }
            .space-y-1 > * + * {
                margin-top: 4px;
            }
            .space-y-2 > * + * {
                margin-top: 8px;
            }
            .grid {
                display: grid;
            }
            .grid-cols-2 {
                grid-template-columns: repeat(2, 1fr);
            }
            .w-full {
                width: 100%;
            }
            .border-collapse {
                border-collapse: collapse;
            }
            .border {
                border-width: 1px;
            }
            .border-t {
                border-top-width: 1px;
                border-top-style: solid;
            }
            .border-b {
                border-bottom-width: 1px;
                border-bottom-style: solid;
            }
            .border-gray-200 {
                border-color: #e5e7eb;
            }
            .border-gray-200.border-t {
                border-top: 1px solid #e5e7eb;
            }
            .border-gray-200.border-b {
                border-bottom: 1px solid #e5e7eb;
            }
            .border-gray-300 {
                border-color: #d1d5db;
            }
            .px-4 {
                padding-left: 16px;
                padding-right: 16px;
            }
            .py-3 {
                padding-top: 12px;
                padding-bottom: 12px;
            }
            .pt-6 {
                padding-top: 24px;
            }
            .bg-gray-50 {
                background-color: #f9fafb;
            }
            table {
                width: 100%;
                border-collapse: collapse;
            }
            th, td {
                border: 1px solid #d1d5db;
                padding: 12px 16px;
                text-align: left;
                font-size: 14px;
            }
            th {
                background-color: #f9fafb;
                font-weight: 500;
                color: #111827;
            }
            td {
                color: #111827;
            }
            @media print {
                body { 
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
            }
        `;
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        const printContent = document.getElementById('invoice-content');
        
        if (printWindow && printContent) {
            const details = invoiceData?.details || {};
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Invoice - ${details.PatientName || 'Invoice'}</title>
                    <style>
                        ${getPrintStyles()}
                    </style>
                </head>
                <body>
                    ${printContent.innerHTML}
                </body>
                </html>
            `);
            
            printWindow.document.close();
            printWindow.focus();
            
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 250);
        }
    };

    const handleDownloadPDF = () => {
        const printWindow = window.open('', '_blank');
        const printContent = document.getElementById('invoice-content');
        
        if (printWindow && printContent) {
            const details = invoiceData?.details || {};
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Invoice - ${details.PatientName || 'Invoice'}</title>
                    <style>
                        ${getPrintStyles()}
                    </style>
                </head>
                <body>
                    ${printContent.innerHTML}
                </body>
                </html>
            `);
            
            printWindow.document.close();
            printWindow.focus();
            
            setTimeout(() => {
                printWindow.print();
                setTimeout(() => {
                    printWindow.close();
                }, 1000);
            }, 250);
        }
    };

    // Extract details and services from invoiceData
    const details = invoiceData?.details || {};
    const services = invoiceData?.services || [];

    // Calculate TotalPrice and DiscountedCost by summing from all services
    const calculatedTotalPrice = services.reduce((sum, service) => {
        return sum + parseFloat(service.TotalPrice || 0);
    }, 0);

    const calculatedDiscountedCost = services.reduce((sum, service) => {
        return sum + parseFloat(service.DiscountedCost || 0);
    }, 0);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {invoiceData && 
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="flex flex-row items-center justify-between">
                    <div className="flex gap-2">
                        <Button onClick={handlePrint} variant="outline" size="sm">
                            <Printer className="h-4 w-4 mr-2" />
                            Print
                        </Button>
                        <Button onClick={handleDownloadPDF} variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                        </Button>
                    </div>
                </DialogHeader>
                <div id="invoice-content" className="max-w-4xl mx-auto p-8 bg-white">
            <div className="flex justify-between items-start mb-8">
                <div className="mb-4">
                    <img 
                        src={Logo} 
                        alt="Kinetara Physiotherapy Logo" 
                        className="w-48 h-24 object-contain"
                    />
                    <div className="text-sm text-gray-600 mt-2 ">
                        <div className="mb-0 text-sm text-gray-600 ml-2">D-584, LGF, Below Axis Bank </div> 
                        <div className="mb-0 text-sm text-gray-600 ml-2">CR Park, New Delhi -110019 </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-sm font-medium text-gray-600">MSME Registration No.: UDYAM-DL-03-0066519</div>
                </div>
            </div>

            <div className="mb-8">
                <div className="border-t border-gray-200 mb-4"></div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Service Invoice</h3>
                <div className="border-b border-gray-200 mb-4"></div>
                <div className="flex justify-between">
                    <div className="space-y-2 text-sm font-medium">
                    <p>Patient Name: {details?.Gender == 1 ? "Mr." : "Ms."} {details.PatientName}</p>
                        <p>Address: {details.Address}</p>
                        <p>Phone: {details.PhoneNumber}</p>
                    </div>
                    <div className="space-y-2 text-sm font-medium">
                        <p>Invoice id: #{details?.TransactionId}</p>
                        <p>Date: {details?.CreatedOn ? new Date(details.CreatedOn).toLocaleDateString() : ''}</p>
                        <p>Doctor: Dr. {details.PhysioName} PT</p>
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-900">S.No</th>
                            <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-900">Description</th>
                            <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-900">Unit Price</th>
                            <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-900">Qty</th>
                            {services.some(service => service.FreeSessions) && <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-900">Free Sessions</th>}
                            <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-900">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map((service, index) => (
                            <tr key={index}>
                                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">{service.PackageName || service.Description || '-'}</td>
                                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">Rs. {parseFloat(service.ChargePerSession || service.UnitPrice || 0).toFixed(2)}</td>
                                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">{service.TotalSessions || service.Qty || '-'}</td>
                                {services.some(s => s.FreeSessions) && <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">{service.FreeSessions || '-'}</td>}
                                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">Rs. {parseFloat(service.TotalPrice || service.Amount || 0).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mb-8">
                <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-600">Sub Total:</span>
                            <span className="text-sm text-gray-900">Rs. {calculatedTotalPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-600">Amount Received:</span>
                            <span className="text-sm text-gray-900">Rs. {parseFloat(details.PackageAdvanceAmount || 0).toFixed(2)}</span>
                        </div>
                        {details?.PaymentMode && (
                            <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-600">Payment Mode:</span>
                                <span className="text-sm text-gray-900">{details.PaymentMode}</span>
                            </div>
                        )}
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-600">Discount:</span>
                            <span className="text-sm text-gray-900">
                                {calculatedTotalPrice > 0 ? Math.round(((calculatedTotalPrice - calculatedDiscountedCost) / calculatedTotalPrice) * 100) : 0}%
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-600">Grand Total:</span>
                            <span className="text-sm text-gray-900">Rs. {calculatedDiscountedCost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-600">Amount To Be Paid:</span>
                            <span className="text-sm text-gray-900">Rs. {(calculatedDiscountedCost - parseFloat(details.PackageAdvanceAmount || 0)).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <span className="text-sm font-bold text-gray-600">{"Note: This package remains valid for 30 days starting from the date of your first session."}</span>
            </div>

            <div className="border-t border-gray-200 pt-6">
                <div className="text-center space-y-2">
                    <p className="text-sm text-gray-600">
                        If you have any questions concerning this invoice, contact kinetaraphysiotherapy@gmail.com, Phone no: 8800974721
                    </p>
                    <p className="text-sm font-medium text-gray-900">Thank you for choosing Kinetara!</p>
                </div>
            </div>
                </div>
            </DialogContent>}
        </Dialog>
    );
};

export default PackageInvoice
import { useQuery } from "@tanstack/react-query";
import { Download, Printer } from "lucide-react";
import Logo from "../assets/Logo.png";
import { getDailyInvoiceData } from "../services/packages-service";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import useDimensions from "../hooks/use-dimension";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

// Reusable Invoice Content Component
const InvoiceContent = ({ invoiceData, contentRef, containerRef }) => {
  const { width } = useDimensions(containerRef);
  if (!invoiceData) return null;
  return (
    <div
      style={{
        zoom: (1 / 794) * width,
      }}
      ref={contentRef}
      id="invoice"
      className="max-w-4xl mx-auto p-8 bg-white"
    >
      <div className="flex justify-between items-start mb-8">
        <div className="mb-4">
          <img
            src={Logo}
            alt="Kinetara Physiotherapy Logo"
            className="w-48 h-24 object-contain"
          />
          <div className="text-sm text-gray-600 mt-2">
            <div className="mb-0 text-sm text-gray-600 ml-2">
              D-584, LGF, Below Axis Bank
            </div>
            <div className="mb-0 text-sm text-gray-600 ml-2">
              CR Park, New Delhi -110019
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-gray-600">
            MSME Registration No.: UDYAM-DL-03-0066519
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="border-t border-gray-200 mb-4"></div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
          Service Invoice
        </h3>
        <div className="border-b border-gray-200 mb-4"></div>
        <div className="flex justify-between">
          <div className="space-y-2 text-sm font-medium">
            <p>Patient Name: {invoiceData?.details?.PatientName}</p>
            <p>Address: {invoiceData?.details?.Address}</p>
            <p>Phone: {invoiceData?.details?.PhoneNumber}</p>
          </div>
          <div className="space-y-2 text-sm font-medium">
            <p>Invoice id: #{invoiceData?.details?.TransactionId}</p>
            <p>Date: {new Date().toLocaleDateString()}</p>
            <p>Doctor: {invoiceData?.details?.PhysioName}</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-900">
                S.No
              </th>
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-900">
                Description
              </th>
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-900">
                Unit Price
              </th>
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-900">
                Qty
              </th>
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-900">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {invoiceData?.services?.map((service, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">
                  {index + 1}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">
                  {service.SessionName}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">
                  Rs. {parseFloat(service.ChargePerSession).toFixed(2)}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">
                  {1}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">
                  Rs. {parseFloat(service.ChargePerSession).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-8">
        <div className="space-y-2">
          <div className="flex justify-end">
            <span className="text-sm font-medium text-gray-600">
              Sub Total:
            </span>
            <span className="text-sm text-gray-900 ml-2">
              Rs. {parseFloat(invoiceData?.details?.TotalCost).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-end">
            <span className="text-sm font-medium text-gray-600">
              Amount Received:
            </span>
            <span className="text-sm text-gray-900 ml-2">
              Rs. {parseFloat(invoiceData?.details?.TotalCost).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <span className="text-sm font-bold text-gray-600">
          Note: This package remains valid for 30 days starting from the date of
          your first session.
        </span>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            If you have any questions concerning this invoice, contact
            kinetaraphysiotherapy@gmail.com, Phone no: 8800974721
          </p>
          <p className="text-sm font-medium text-gray-900">
            Thank you for choosing Kinetara!
          </p>
        </div>
      </div>
    </div>
  );
};

// Main Dialog Component
const DailyInvoice = ({ open, onOpenChange, appointment }) => {
  const { data: invoiceData, isLoading } = useQuery({
    queryKey: [
      "daily-invoice",
      appointment.PatientId,
      appointment.AppointmentId,
    ],
    queryFn: () =>
      getDailyInvoiceData({
        patientId: appointment.PatientId,
        appointmentId: appointment.AppointmentId,
      }),
    enabled: !!(appointment.PatientId && appointment.AppointmentId),
  });

  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const reactToPrint = useReactToPrint({
    contentRef,
    documentTitle: "Invoice",
  });
  const handlePrint = () => {
    reactToPrint();
  };

  const handleDownloadPDF = () => {
    reactToPrint();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {invoiceData && (
        <DialogContent
          showCloseButton={false}
          className="max-w-5xl max-h-[90vh] overflow-y-auto"
        >
          <DialogHeader className="flex flex-row items-center justify-end">
            <div className="flex gap-2">
              <Button
                onClick={handlePrint}
                variant="outline"
                size="sm"
                className="cursor-pointer"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button
                onClick={handleDownloadPDF}
                variant="outline"
                size="sm"
                className="cursor-pointer"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </DialogHeader>
          <div ref={containerRef} id="invoice-content">
            <InvoiceContent
              invoiceData={invoiceData}
              contentRef={contentRef}
              containerRef={containerRef}
            />
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default DailyInvoice;

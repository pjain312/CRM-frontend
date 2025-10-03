import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { PrinterIcon } from "lucide-react";
import useDimensions from "../hooks/use-dimension";
import { useReactToPrint } from "react-to-print";

// Prescription Form Component - Exact match to PDF
const PrescriptionForm = ({
  contentRef,
  containerRef,
  appointment,
  patient,
}) => {
  const { width } = useDimensions(containerRef);
  return (
    <div
      style={{
        zoom: (1 / 794) * width,
      }}
      ref={contentRef}
      id="prescription-form"
      className="bg-white w-full max-w-[210mm] mx-auto min-h-[297mm] p-8 relative"
    >
      {/* Vertical Line */}
      <div className="absolute left-[40%] top-[14%] bottom-[11%] w-0.5 bg-[#2596be]"></div>

      {/* Horizontal Line */}
      <div className="absolute left-[5%] bottom-[120px] right-[5%] h-0.5 bg-[#2596be]"></div>

      {/* Header Section */}
      <div className="header-section border-b-2 border-gray-800 pb-6 mb-8">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img
              src="/src/assets/Logo.webp"
              alt="Kinetara Logo"
              className="h-20 w-auto"
            />
          </div>

          {/* Patient Info */}
          <div className="flex-1">
            <div className="grid grid-cols-3 gap-6 text-sm">
              <div className="flex py-2">
                <span className="font-bold text-gray-600 mr-2">Name:</span>
                <span className="text-gray-800">{patient?.Name || "N/A"}</span>
              </div>
              <div className="flex py-2">
                <span className="font-bold text-gray-600 mr-2">Gender:</span>
                <span className="text-gray-800">
                  {patient?.Gender || "N/A"}
                </span>
              </div>
              <div className="flex py-2">
                <span className="font-bold text-gray-600 mr-2">Age:</span>
                <span className="text-gray-800">
                  {patient?.Age ? `${patient.Age} years` : "N/A"}
                </span>
              </div>
              <div className="flex py-2">
                <span className="font-bold text-gray-600 mr-2">Phone:</span>
                <span className="text-gray-800">
                  {patient?.PhoneNumber || "N/A"}
                </span>
              </div>
              <div className="flex py-2 col-span-2">
                <span className="font-bold text-gray-600 mr-2">Address:</span>
                <span className="text-gray-800">
                  {patient?.Address || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section with absolute positioning */}
      <div className="content-section relative min-h-[600px]">
        {/* Left Column */}
        <div className="absolute left-0 top-0 w-[35%] pr-4">
          {/* CC Section */}
          <div className="mb-8">
            <div className="text-sm font-bold text-gray-800 mb-2">CC:</div>
            <div className="min-h-[100px] p-2 text-xs bg-white"></div>
          </div>

          {/* H/O Section */}
          <div className="mb-8">
            <div className="text-sm font-bold text-gray-800 mb-2">H/O:</div>
            <div className="min-h-[100px] p-2 text-xs bg-white"></div>
          </div>

          {/* Symptoms Section */}
          <div className="mb-8">
            <div className="text-sm font-bold text-gray-800 mb-2">
              Symptoms:
            </div>
            <div className="min-h-[100px] p-2 text-xs bg-white"></div>
          </div>

          {/* Conditions Section */}
          <div className="mb-8">
            <div className="text-sm font-bold text-gray-800 mb-2">
              Conditions:
            </div>
            <div className="min-h-[100px] p-2 text-xs bg-white"></div>
          </div>
        </div>

        {/* Right Column */}
        <div className="absolute left-[45%] top-0 w-[50%]">
          {/* Treatment Section */}
          <div className="mb-8">
            <div className="text-sm font-bold text-gray-800 mb-2">
              Treatment:
            </div>
            <div className="min-h-[180px] p-2 text-xs bg-white"></div>
          </div>

          {/* Home Advice Section */}
          <div className="mb-8">
            <div className="text-sm font-bold text-gray-800 mb-2">
              Home Advice:
            </div>
            <div className="min-h-[180px] p-2 text-xs bg-white"></div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="footer-section absolute bottom-0 left-8 right-8">
        <div className="flex justify-between items-end">
          {/* Clinic Address */}
          <div className="clinic-address text-xs text-gray-600">
            <p>D-584, LGF, Below Axis Bank, CR Park, New Delhi -110019</p>
            <p>Call us @ 8800974721</p>
          </div>

          {/* Signature */}
          <div className="signature-section text-right">
            <div className="border-t border-gray-800 w-[200px] ml-auto mt-5 mb-2"></div>
            <p className="text-gray-600 font-bold mb-4">Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Dialog Component
function PrescriptionDialog({ appointment, patient, open, onOpenChange }) {
  const [internalOpen, setInternalOpen] = useState(false);
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const reactToPrint = useReactToPrint({
    contentRef,
    documentTitle: "Prescription",
  });

  // Use internal state if no external state is provided
  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  // Print function
  const handlePrint = () => {
    reactToPrint();
  };

  // Handle Ctrl+P keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === "p" && isOpen) {
        event.preventDefault();
        handlePrint();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="flex px-2 w-full hover:bg-accent font-normal py-1.5 text-sm rounded-sm">
        Generate Prescription
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        {/* Dialog Header */}
        <div className="no-print bg-white border-b p-4 sticky top-0 z-10">
          <DialogHeader>
            <div className="flex justify-end items-center gap-4">
              <div className="p-2 hidden md:block rounded-lg">
                <p className="text-xs text-muted-foreground text-center sm:text-left">
                  <strong>Keyboard shortcut:</strong> Press{" "}
                  <kbd className="px-2 py-1 bg-background border rounded text-xs">
                    Ctrl
                  </kbd>{" "}
                  +{" "}
                  <kbd className="px-2 py-1 bg-background border rounded text-xs">
                    P
                  </kbd>{" "}
                  to print
                </p>
              </div>
              <Button
                onClick={handlePrint}
                className="flex items-center  gap-2 sm:w-auto cursor-pointer"
              >
                <PrinterIcon className="h-4 w-4" />
                Print Prescription
              </Button>
            </div>
          </DialogHeader>
        </div>

        {/* Prescription Form */}
        <div ref={containerRef} className="flex-1 p-4">
          <PrescriptionForm
            contentRef={contentRef}
            containerRef={containerRef}
            appointment={appointment}
            patient={patient}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PrescriptionDialog;

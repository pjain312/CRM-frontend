import { useEffect, useState } from "react";
import { getPatientPackages, payPackageDues } from "../services/patient-service";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner";

const PatientPackagesTab = ({ patientId, isPatientClosed}) => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState("");
    const [paymentMode, setPaymentMode] = useState("");
  
    useEffect(() => {
      fetchPackages();
    }, [patientId]);
  
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const data = await getPatientPackages(patientId);
        const sortedPackages = data.sort((a, b) => {
          const aIsActive = parseFloat(a.TotalCost) > parseFloat(a.AmountPaid);
          const bIsActive = parseFloat(b.TotalCost) > parseFloat(b.AmountPaid);
          
          if (aIsActive && !bIsActive) return -1;
          if (!aIsActive && bIsActive) return 1;
          
          return 0;
        });
        setPackages(sortedPackages);
      } catch (error) {
        console.error('Error fetching packages:', error);
      } finally {
        setLoading(false);
      }
    };
  
    const handlePaymentClick = (pkg) => {
      setSelectedPackage(pkg);
      setPaymentAmount((parseFloat(pkg.TotalCost) - parseFloat(pkg.AmountPaid)).toFixed(2));
      setPaymentMode("");
      setPaymentDialogOpen(true);
    };

    const handlePaymentSubmit = async () => {
      try {
        const paymentData = {
          patientPackageId: selectedPackage.PatientPackageId,
          sessionCharges: parseInt(paymentAmount),
          paymentMode: paymentMode,
          patientId: patientId
        };
        
        await payPackageDues(paymentData);
        
        // Show success message
        toast.success(`Payment of Rs. ${parseFloat(paymentAmount).toFixed(2)} processed successfully`);
        
        // Close dialog and reset form
        setPaymentDialogOpen(false);
        setSelectedPackage(null);
        setPaymentAmount("");
        setPaymentMode("");
        
        // Refresh package data to update the card values
        await fetchPackages();
        
      } catch (error) {
        console.error('Error processing payment:', error);
        toast.error('Failed to process payment. Please try again.');
      }
    };
  
    if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Package Information</h3>
        </div>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Package Information</h3>
          </div>
          
          {packages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No packages assigned to this patient</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
            {packages.map((pkg, index) => {
              const progress = pkg.TotalSessions > 0 ? (pkg.CompletedSessions / pkg.TotalSessions) * 100 : 0;
              
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-lg">{pkg.Name}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {pkg.CompletedSessions}/{pkg.TotalSessions} sessions completed
                        </p>
                      </div>
                      <Badge 
                        className={
                          pkg.TotalSessions - pkg.CompletedSessions === 0
                            ? 'bg-green-100 text-green-800' 
                            :  'bg-blue-100 text-blue-800' 
                        }
                      >
                        {pkg.TotalSessions - pkg.CompletedSessions === 0 ? 'Completed' : 'Active'}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Charge Per Session</span>
                        <span className="font-semibold">Rs. {parseFloat(pkg.ChargePerSession).toFixed(2)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total Amount</span>
                        <span className="font-semibold text-lg text-green-600">Rs. {parseFloat(pkg.TotalCost).toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Paid Amount</span>
                        <span className="font-semibold text-lg">Rs. {parseFloat(pkg.AmountPaid).toFixed(2)}</span>
                      </div>

                    </div>

                    {parseFloat(pkg.TotalCost) > parseFloat(pkg.AmountPaid) && (
                      <div className="pt-3 border-t">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Outstanding Amount</span>
                          <span className="font-semibold text-lg text-red-600">
                            Rs. {(parseFloat(pkg.TotalCost) - parseFloat(pkg.AmountPaid)).toFixed(2)}
                          </span>
                        </div>
                        {!isPatientClosed && <Button 
                          className="w-full" 
                          size="sm"
                          onClick={() => handlePaymentClick(pkg)}
                        >
                          Pay Now
                        </Button>}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
            </div>
          )}
        </div>

        {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Make Payment</DialogTitle>
          </DialogHeader>
          
          {selectedPackage && (
            <div className="space-y-4">
              {/* Package Name */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-lg">{selectedPackage.Name}</h3>
                <p className="text-sm text-gray-600">Package Payment</p>
              </div>

              {/* Payment Details */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Amount:</span>
                  <span className="font-medium">Rs. {parseFloat(selectedPackage.TotalCost).toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Amount Paid:</span>
                  <span className="font-medium">Rs. {parseFloat(selectedPackage.AmountPaid).toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between border-t pt-2">
                  <span className="text-sm font-medium">Outstanding:</span>
                  <span className="font-semibold text-red-600">
                    Rs. {(parseFloat(selectedPackage.TotalCost) - parseFloat(selectedPackage.AmountPaid)).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Payment Amount Input */}
              <div className="space-y-2">
                <Label htmlFor="paymentAmount">Payment Amount</Label>
                <Input
                  id="paymentAmount"
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="Enter amount to pay"
                  step="0.01"
                  min="0"
                  max={parseFloat(selectedPackage.TotalCost) - parseFloat(selectedPackage.AmountPaid)}
                />
              </div>

              {/* Payment Mode Selection */}
              <div className="space-y-2">
                <Label htmlFor="paymentMode">Payment Mode</Label>
                <Select value={paymentMode} onValueChange={setPaymentMode}>
                  <SelectTrigger className="w-full min-w-full">
                    <SelectValue placeholder="Select payment mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Cash</SelectItem>
                    <SelectItem value="2">UPI</SelectItem>
                    <SelectItem value="3">Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setPaymentDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handlePaymentSubmit}
                  className="flex-1"
                  disabled={!paymentAmount || parseFloat(paymentAmount) <= 0 || !paymentMode}
                >
                  Pay Rs. {parseFloat(paymentAmount || 0).toFixed(2)}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      </>
    );
};
  
  export default PatientPackagesTab;
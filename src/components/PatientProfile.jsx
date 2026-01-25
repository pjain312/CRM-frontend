import { AlertCircle, ArrowLeft, Calendar, CreditCard, Mail, MapPin, MoreVertical, Package, Phone, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { paymentColumns } from '../lib/patient-profile.columns';
import { reopenPatient } from '../services/leads-service';
import {
  getPatientDetails,
  getPatientTransactions
} from '../services/patient-service';
import AddLeadForm from './add-lead-form';
import ClosePatientForm from './close-patient-form';
import DailyInvoice from './daily-invoice';
import { DataTable } from './data-table';
import PackageInvoice from './package-invoice';
import PatientAppointmentTab from './PatientAppointmentTab';
import PatientPackagesTab from './PatientPackagesTab';
import PrescriptionDialog from './prescription-dialog';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from './ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
// import ProductInvoice from './product-invoice';

const PatientProfile = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [activeTab, setActiveTab] = useState('appointments');
  const [loading, setLoading] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);
  
  // Invoice state management
  const [packageInvoiceOpen, setPackageInvoiceOpen] = useState(false);
  const [dailyInvoiceOpen, setDailyInvoiceOpen] = useState(false);
  const [productInvoiceOpen, setProductInvoiceOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    fetchPatientDetails();
  }, [patientId]);

  useEffect(()=>{
    setPopupOpen(!!patient?.IsPatientClosed)
  }, [patient?.IsPatientClosed])


  const reOpenPatient = async () => {
    try {
      setLoading(true);
      await reopenPatient({patientId});
      await fetchPatientDetails();
      toast.success('Patient reopened successfully');
    } catch (error) {
      console.error('Error reopening patient:', error);
      toast.error('Failed to reopen patient');
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientDetails = async () => {
    try {
      setLoading(true);
      const patientData = await getPatientDetails(patientId);
      setPatient(patientData);
    } catch (error) {
      console.error('Error fetching patient details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Function to handle invoice opening
  const handleInvoiceOpen = (payment) => {
    setSelectedPayment(payment);
    if (payment.PackageId) {
      setPackageInvoiceOpen(true);
    } 
    // else if (payment.ProductId) {
    //   setProductInvoiceOpen(true);
    // }
     else {
      setDailyInvoiceOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Patient not found</p>
        <Button onClick={() => navigate(-1)} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-3 md:p-6 space-y-4 md:space-y-6">
      {/* Closed Patient Dialog */}
      <Dialog open={popupOpen} onOpenChange={setPopupOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-orange-600" />
              </div>
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Patient Closed
              </DialogTitle>
            </div>
            <DialogDescription className="text-base text-gray-600 mt-2">
              This patient account has been closed.
            </DialogDescription>
          </DialogHeader>
          {patient.PatientCloseReason && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 mb-1">Reason:</p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {patient.PatientCloseReason}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2 mt-6">
            <Button
              onClick={reOpenPatient}
              disabled={loading}
              className="w-full sm:w-auto cursor-pointer"
            >
              {loading ? 'Reopening...' : 'Reopen Patient'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center space-x-2 md:space-x-4 min-w-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 flex-shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="h-6 hidden sm:block" />
          <h1 className="text-lg md:text-2xl font-bold truncate">Patient Profile</h1>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {!patient?.IsPatientClosed && <DropdownMenuItem asChild>
              <AddLeadForm type="edit" patient={{...patient, Source: patient.LeadSource}} onSuccess={fetchPatientDetails} />
            </DropdownMenuItem>}
            {!patient?.IsPatientClosed && <DropdownMenuItem asChild>
              <PrescriptionDialog patient={patient} />
            </DropdownMenuItem>}
            {!patient?.IsPatientClosed &&
                <DropdownMenuItem asChild>
                  <ClosePatientForm leadData={patient} onPatientUpdate={fetchPatientDetails} />
                </DropdownMenuItem>
            }
            {!!patient?.IsPatientClosed && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick ={reOpenPatient}>
                  Reopen Patient
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Patient Header Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="flex items-center space-x-3 md:space-x-6 min-w-0 flex-1">
              <Avatar className="h-16 w-16 md:h-20 md:w-20 flex-shrink-0">
                <AvatarFallback className="text-base md:text-lg font-semibold">
                  {getInitials(patient?.Name)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2 min-w-0 flex-1">
                <div>
                  <h2 className="text-lg md:text-2xl font-bold break-words">{patient.Gender === "Male" ? "Mr. " : "Ms. "}{patient.Name}</h2>
                </div>
                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                  <Badge className={patient.IsPatientClosed ? "bg-green-100 text-green-800": "bg-blue-100 text-blue-800"}>
                    {patient.IsPatientClosed ? "Closed": "Active"}
                  </Badge>
                  <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3 md:h-3.5 md:w-3.5 text-gray-400 flex-shrink-0" />
                      <span className="whitespace-nowrap">
                        Registered: <span className="font-medium text-gray-700">{new Date(patient.RegistrationDate).toLocaleDateString()}</span>
                      </span>
                    </div>
                    <span className="text-gray-400 hidden sm:inline">•</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-500">Source:</span>
                      <Badge variant="outline" className="text-xs font-normal px-2 py-0.5">
                        {patient.Source}
                      </Badge>
                    </div>
                    {patient.LeadTypeName && (
                      <>
                        <span className="text-gray-400 hidden sm:inline">•</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-gray-500">Type:</span>
                          <Badge variant="outline" className="text-xs font-normal px-2 py-0.5">
                            {patient.LeadTypeName}
                          </Badge>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="text-left sm:text-right space-y-2 flex-shrink-0">
             {!patient?.IsPatientClosed && <div className="text-lg md:text-xl font-bold text-green-600">
                {patient.InPackage ? "In Package" : "Daily"}
              </div>}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <User className="h-4 w-4 mr-2" />
                Contact Information
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{patient?.Email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{patient?.PhoneNumber}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{patient?.Address}, {patient?.City}, {patient?.State} {patient?.Pincode}</span>
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Medical Information</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Age:</span> {patient.Age} years ({patient.Gender})
                </div>
                <div>
                  <span className="font-medium">Condition:</span> {patient.Condition}
                </div>
                <div>
                  <span className="font-medium">Treatment:</span> {patient.Treatment}
                </div>
                <div>
                  <span className="font-medium">Assigned To:</span> Dr. {patient.AssignedPhysio} PT
                </div>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="appointments" className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm">
                <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">Appointments</span>
                <span className="sm:hidden">Apps</span>
              </TabsTrigger>
              <TabsTrigger value="payments" className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm">
                <CreditCard className="h-3 w-3 md:h-4 md:w-4" />
                <span>Payments</span>
              </TabsTrigger>
              {!!patient?.InPackage &&
                <TabsTrigger value="packages" className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm">
                <Package className="h-3 w-3 md:h-4 md:w-4" />
                <span>Packages</span>
                </TabsTrigger>
              }
            </TabsList>

            <TabsContent value="appointments" className="p-3 md:p-6">
              <PatientAppointmentTab patientId={patientId} isPatientClosed = {patient?.IsPatientClosed} />
            </TabsContent>

            <TabsContent value="payments" className="p-3 md:p-6">
              <PaymentsTab patientId={patientId} onInvoiceOpen={handleInvoiceOpen} />
            </TabsContent>

            {!!patient?.InPackage && <TabsContent value="packages" className="p-3 md:p-6">
              <PatientPackagesTab patientId={patientId} isPatientClosed = {patient?.IsPatientClosed}/>
            </TabsContent>}
          </Tabs>
        </CardContent>
      </Card>

      {/* Invoice Dialogs */}
      {selectedPayment && (
         <>
        {selectedPayment?.PackageId ?
          <PackageInvoice
            open={packageInvoiceOpen}
            onOpenChange={setPackageInvoiceOpen}
            appointment={{
              PatientId: patientId,
              paymentTransactionId: selectedPayment.Id, // Using TransactionId as paymentTransactionId
            }}
          /> :
          <DailyInvoice
            open={dailyInvoiceOpen}
            onOpenChange={setDailyInvoiceOpen}
            appointment={{
              PatientId: patientId,
              AppointmentId: selectedPayment.AppointmentId,
            }}
          />}
        </>
      )}
    </div>
  );
};


// Payments Tab Component
const PaymentsTab = ({ patientId, onInvoiceOpen }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, [patientId]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const data = await getPatientTransactions(patientId);
      setPayments(data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base md:text-lg font-semibold">Payment History</h3>
      </div>
      <DataTable columns={paymentColumns(onInvoiceOpen)} data={payments} loading={loading} />
    </div>
  );
};

export default PatientProfile;

import { ArrowLeft, Calendar, CreditCard, Mail, MapPin, Package, Phone, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { paymentColumns } from '../lib/patient-profile.columns';
import {
  getPatientDetails,
  getPatientTransactions
} from '../services/patient-service';
import DailyInvoice from './daily-invoice';
import { DataTable } from './data-table';
import PackageInvoice from './package-invoice';
import PatientAppointmentTab from './PatientAppointmentTab';
import PatientPackagesTab from './PatientPackagesTab';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const PatientProfile = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [activeTab, setActiveTab] = useState('appointments');
  const [loading, setLoading] = useState(true);
  
  // Invoice state management
  const [packageInvoiceOpen, setPackageInvoiceOpen] = useState(false);
  const [dailyInvoiceOpen, setDailyInvoiceOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    fetchPatientDetails();
  }, [patientId]);

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
    } else {
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
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <h1 className="text-2xl font-bold">Patient Profile</h1>
        </div>
      </div>

      {/* Patient Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-lg font-semibold">
                  {getInitials(patient?.Name)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <div>
                  <h2 className="text-2xl font-bold">{patient.Gender === "Male" ? "Mr. " : "Ms. "}{patient.Name}</h2>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge className={patient.IsPatientClosed ? "bg-green-100 text-green-800": "bg-blue-100 text-blue-800"}>
                    {patient.IsPatientClosed ? "Closed": "Active"}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    Registered: {new Date(patient.RegistrationDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right space-y-2">
              <div className="text-xl font-bold text-green-600">
                {patient.InPackage ? "In Package" : "Daily"}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  <span className="font-medium">Assigned To:</span> Dr. {patient.AssignedTo} PT
                </div>
              </div>
            </div>

            {/* Session Summary */}
            {!!patient.InPackage && 
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Session Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Sessions:</span>
                  <span className="font-medium">{patient.TotalSessions}</span>
                </div>
                <div className="flex justify-between">
                  <span>Completed:</span>
                  <span className="font-medium text-green-600">{patient.CompletedSessions}</span>
                </div>
                <div className="flex justify-between">
                  <span>Remaining:</span>
                  <span className="font-medium text-orange-600">{patient.TotalSessions - patient.CompletedSessions}</span>
                </div>
                  {/* <div className="flex justify-between">
                    <span>Last Visit:</span>
                    <span className="font-medium">{new Date(patient.LastVisit).toLocaleDateString()}</span>
                  </div> */}
              </div>
            </div>
          }
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="appointments" className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Appointments</span>
              </TabsTrigger>
              <TabsTrigger value="payments" className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4" />
                <span>Payments</span>
              </TabsTrigger>
              {!!patient?.InPackage &&
                <TabsTrigger value="packages" className="flex items-center space-x-2">
                <Package className="h-4 w-4" />
                <span>Packages</span>
                </TabsTrigger>
              }
            </TabsList>

            <TabsContent value="appointments" className="p-6">
              <PatientAppointmentTab patientId={patientId} />
            </TabsContent>

            <TabsContent value="payments" className="p-6">
              <PaymentsTab patientId={patientId} onInvoiceOpen={handleInvoiceOpen} />
            </TabsContent>

            {!!patient?.InPackage && <TabsContent value="packages" className="p-6">
              <PatientPackagesTab patientId={patientId} />
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
        <h3 className="text-lg font-semibold">Payment History</h3>
      </div>
      <DataTable columns={paymentColumns(onInvoiceOpen)} data={payments} loading={loading} />
    </div>
  );
};

export default PatientProfile;

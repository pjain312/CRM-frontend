import { Banknote, Calendar, CreditCard, DollarSign, Filter, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { DataTable } from "../../components/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { paymentColumns } from "../../lib/patient-profile.columns";
import { getAllPayments } from "../../services/payments-service";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Current month (1-12)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedPaymentMode, setSelectedPaymentMode] = useState("all"); // Filter by payment mode

  // Generate month options
  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  // Generate year options (current year and 2 years back)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 3 }, (_, i) => currentYear - i);

  useEffect(() => {
    fetchPayments();
  }, [selectedMonth, selectedYear]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const data = await getAllPayments({
        month: selectedMonth,
        year: selectedYear,
      });
      setPayments(data || []);
    } catch (error) {
      console.error("Error fetching payments:", error);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInvoiceOpen = (payment) => {
    // Handle invoice opening if needed
    console.log("Invoice open:", payment);
  };

  // Calculate collections by payment mode
  const totalCollection = payments.reduce((sum, payment) => {
    return sum + (parseFloat(payment.Amount) || 0);
  }, 0);

  const upiCollection = payments.reduce((sum, payment) => {
    const paymentMode = payment.PaymentMode?.toLowerCase()
    const isUPI = paymentMode === "upi";
    return sum + (isUPI ? (parseFloat(payment.Amount) || 0) : 0);
  }, 0);

  const cashCollection = payments.reduce((sum, payment) => {
    const paymentMode = payment.PaymentMode?.toLowerCase();
    const isCash = paymentMode === "cash";
    return sum + (isCash ? (parseFloat(payment.Amount) || 0) : 0);
  }, 0);

  const cardCollection = payments.reduce((sum, payment) => {
    const paymentMode = payment.PaymentMode?.toLowerCase();
    const isCard = paymentMode === "card";
    return sum + (isCard ? (parseFloat(payment.Amount) || 0) : 0);
  }, 0);

  // Filter payments based on selected payment mode
  const filteredPayments = payments.filter((payment) => {
    if (selectedPaymentMode === "all") return true;
    const paymentMode = payment.PaymentMode?.toLowerCase();
    return paymentMode === selectedPaymentMode.toLowerCase();
  });

  return (
    <div className="container mx-auto p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold">All Payments</h1>
        </div>
        
        {/* Month, Year, and Payment Mode Selectors */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <Select
              value={selectedMonth.toString()}
              onValueChange={(value) => setSelectedMonth(parseInt(value))}
            >
              <SelectTrigger className="w-full sm:w-[140px] text-sm">
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value.toString()}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Select
            value={selectedYear.toString()}
            onValueChange={(value) => setSelectedYear(parseInt(value))}
          >
            <SelectTrigger className="w-full sm:w-[100px] text-sm">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Filter className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <Select
              value={selectedPaymentMode}
              onValueChange={setSelectedPaymentMode}
            >
              <SelectTrigger className="w-full sm:w-[130px] text-sm">
                <SelectValue placeholder="Payment Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Card</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Collection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Collection Card */}
        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6 pt-3 sm:pt-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs sm:text-sm font-semibold text-gray-700">Total Collection</CardTitle>
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600 mb-1">
              ₹{totalCollection.toFixed(2)}
            </div>
            <p className="text-xs text-gray-500 truncate">
              {months.find((m) => m.value === selectedMonth)?.label} {selectedYear}
            </p>
          </CardContent>
        </Card>

        {/* UPI Collection Card */}
        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6 pt-3 sm:pt-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs sm:text-sm font-semibold text-gray-700">UPI Collection</CardTitle>
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600 mb-1">
              ₹{upiCollection.toFixed(2)}
            </div>
            <p className="text-xs text-gray-500">
              {totalCollection > 0 ? ((upiCollection / totalCollection) * 100).toFixed(1) : 0}% of total
            </p>
          </CardContent>
        </Card>

        {/* Cash Collection Card */}
        <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6 pt-3 sm:pt-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs sm:text-sm font-semibold text-gray-700">Cash Collection</CardTitle>
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                <Banknote className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-600 mb-1">
              ₹{cashCollection.toFixed(2)}
            </div>
            <p className="text-xs text-gray-500">
              {totalCollection > 0 ? ((cashCollection / totalCollection) * 100).toFixed(1) : 0}% of total
            </p>
          </CardContent>
        </Card>

        {/* Card Collection Card */}
        <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6 pt-3 sm:pt-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs sm:text-sm font-semibold text-gray-700">Card Collection</CardTitle>
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-600 mb-1">
              ₹{cardCollection.toFixed(2)}
            </div>
            <p className="text-xs text-gray-500">
              {totalCollection > 0 ? ((cardCollection / totalCollection) * 100).toFixed(1) : 0}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <Card>
        <CardContent className="p-0">
          <div className="p-2 sm:p-4 md:p-6 overflow-x-auto">
            <DataTable
              columns={paymentColumns(handleInvoiceOpen, true)}
              data={filteredPayments}
              loading={loading}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Payments;


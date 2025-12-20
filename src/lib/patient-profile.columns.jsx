import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

// Appointments Columns
export const appointmentColumns = [
  {
    accessorKey: "appointmentDate",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("appointmentDate"));
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: "appointmentTime",
    header: "Time",
  },
  {
    accessorKey: "appointmentType",
    header: "Type",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
          case 'completed':
            return 'bg-green-100 text-green-800';
          case 'scheduled':
            return 'bg-blue-100 text-blue-800';
          case 'cancelled':
            return 'bg-red-100 text-red-800';
          case 'rescheduled':
            return 'bg-yellow-100 text-yellow-800';
          default:
            return 'bg-gray-100 text-gray-800';
        }
      };
      return <Badge className={getStatusColor(status)}>{status}</Badge>;
    },
  },
  {
    accessorKey: "physio",
    header: "Physiotherapist",
  },
  {
    accessorKey: "comments",
    header: "Comments",
    cell: ({ row }) => {
      const comments = row.getValue("comments");
      return <div className="max-w-xs truncate">{comments || "-"}</div>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Cancel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

// Payments Columns
export const paymentColumns = (onInvoiceOpen, showPatientName = false) => [
  {
    accessorKey: "CreatedOn",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("CreatedOn"));
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  ...(showPatientName ? [{
    accessorKey: "PatientName",
    header: "Patient Name",
    cell: ({ row }) => {
      const patientName = row.getValue("PatientName");
      return <div className="font-medium">{patientName || "-"}</div>;
    },
  }] : []),
  {
    accessorKey: "Amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = row.getValue("Amount");
      return <div className="font-medium">Rs. {parseFloat(amount).toFixed(2)}</div>;
    },
  },
  {
    accessorKey: showPatientName? "PatientPackageId": "PackageName",
    header: showPatientName? "Package/Daily" : "Package Name",
    cell: ({ row }) => {
      const packageName = row.getValue(showPatientName? "PatientPackageId": "PackageName");
      return <div>{showPatientName ? (packageName ? "Package" : "Daily") : packageName || "-"}</div>;
    },
  },
  {
    accessorKey: "PaymentMode",
    header: "Payment Mode",
  },
  {
    accessorKey: "TransactionId",
    header: "Invoice #",
    cell: ({ row }) => {
      const transactionId = row.getValue("TransactionId");
      return <div className="font-medium">#{transactionId}</div>;
    },
  },
  ...(!showPatientName ? [{
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onInvoiceOpen && onInvoiceOpen(row.original)}>
              <Eye className="mr-2 h-4 w-4" />
              View Invoice
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }] : []),
];

// Packages Columns
export const packageColumns = [
  {
    accessorKey: "packageName",
    header: "Package Name",
  },
  {
    accessorKey: "totalSessions",
    header: "Total Sessions",
    cell: ({ row }) => {
      const total = row.getValue("totalSessions");
      return <div className="text-center">{total}</div>;
    },
  },
  {
    accessorKey: "completedSessions",
    header: "Progress",
    cell: ({ row }) => {
      const completed = row.getValue("completedSessions");
      const total = row.original.totalSessions;
      const progress = total > 0 ? (completed / total) * 100 : 0;
      
      return (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span>{completed}/{total}</span>
            <span className="text-gray-500">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "chargePerSession",
    header: "Per Session",
    cell: ({ row }) => {
      const amount = row.getValue("chargePerSession");
      return <div className="font-medium">${amount}</div>;
    },
  },
  {
    accessorKey: "totalCost",
    header: "Total Cost",
    cell: ({ row }) => {
      const amount = row.getValue("totalCost");
      return <div className="font-medium">${amount}</div>;
    },
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("startDate"));
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("endDate"));
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
          case 'active':
            return 'bg-green-100 text-green-800';
          case 'completed':
            return 'bg-blue-100 text-blue-800';
          case 'expired':
            return 'bg-red-100 text-red-800';
          case 'cancelled':
            return 'bg-gray-100 text-gray-800';
          default:
            return 'bg-gray-100 text-gray-800';
        }
      };
      return <Badge className={getStatusColor(status)}>{status}</Badge>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit Package
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span className="mr-2">📊</span>
              View Progress
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

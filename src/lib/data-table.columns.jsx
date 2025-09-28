"use client";

import * as React from "react";
import { MoreHorizontal } from "lucide-react";

import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import { Badge } from "../components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import ScheduleAppointmentForm from "../components/schedule-appointment-form";
import PatientInfo from "../components/patient-info";
import AddLeadForm from "../components/add-lead-form";
import PatientFollowup from "../components/patient-followup";
import AddPackageForm from "../components/add-package-form";
import RescheduleConfirmAppointmentForm from "../components/reschedule-confirm-appointment-form";
import AddSessionTypeForm from "../components/add-session-type-form";
import { deletePackage, deleteSessionType } from "../services/packages-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import AppointmentDetail from "../components/appointment-detail";
import { checkinPatient, endSession, startSession } from "../services/session-service";
import CancelAppointmentForm from "../components/cancel-appointment-form";
import CheckoutPatientForm from "../components/checkout-patient-form";
import { getPatientPrescription } from "../components/prescription";
import PackageInvoice from "../components/package-invoice";

export const leadsColumns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "Name",
    header: "Name",
    cell: ({ row }) => <div className="capitalize">{row.getValue("Name")}</div>,
  },
  {
    accessorKey: "Age",
    header: "Age",
    cell: ({ row }) => <div>{row.getValue("Age")}</div>,
  },
  {
    accessorKey: "Gender",
    header: () => "Gender",
    cell: ({ row }) => <div>{row.getValue("Gender")}</div>,
  },
  {
    accessorKey: "Email",
    header: () => "Email",
    cell: ({ row }) => <div>{row.getValue("Email")}</div>,
  },
  {
    accessorKey: "PhoneNumber",
    header: () => "Phone",
    cell: ({ row }) => <div>{row.getValue("PhoneNumber")}</div>,
  },
  {
    accessorKey: "City",
    header: () => "City",
    cell: ({ row }) => <div>{row.getValue("City")}</div>,
  },
  {
    accessorKey: "LeadStatusName",
    header: () => "Status",
    cell: ({ row }) => (
      <Badge
        className={`${
          row.getValue("LeadStatusName") === "Assigned"
            ? "border-blue-500 bg-blue-100 text-blue-500"
            : "border-red-500 bg-red-100 text-red-500"
        }`}
      >
        {row.getValue("LeadStatusName")}
      </Badge>
    ),
  },
  {
    accessorKey: "PhysioPreferenceName",
    header: () => "Physio Preference",
    cell: ({ row }) => <div>{row.getValue("PhysioPreferenceName")}</div>,
  },
  {
    accessorKey: "LeadTypeName",
    header: () => "Type",
    cell: ({ row }) => <div>{row.getValue("LeadTypeName")}</div>,
  },
  {
    id: "actions",
    header: () => "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const statusName = (row?.original?.LeadStatusName || "")
        .toString()
        .toLowerCase();
      const isAssignedOrClosed =
        statusName === "assigned" ||
        statusName === "closed" ||
        statusName === "2";
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <AddLeadForm type="edit" patient={row.original} />
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <PatientFollowup patient={row.original} />
            </DropdownMenuItem>
            <DropdownMenuItem asChild disabled={isAssignedOrClosed}>
              <AddLeadForm
                type="assign"
                patient={row.original}
                disabled={isAssignedOrClosed}
              />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const patientListsColumns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "Name",
    header: "Name",
    cell: ({ row }) => <div className="capitalize">{row.getValue("Name")}</div>,
  },
  {
    accessorKey: "Age",
    header: "Age",
    cell: ({ row }) => <div>{row.getValue("Age")}</div>,
  },
  {
    accessorKey: "Gender",
    header: () => "Gender",
    cell: ({ row }) => <div>{row.getValue("Gender")}</div>,
  },
  {
    accessorKey: "Email",
    header: () => "Email",
    cell: ({ row }) => <div>{row.getValue("Email")}</div>,
  },
  {
    accessorKey: "PhoneNumber",
    header: () => "Phone",
    cell: ({ row }) => <div>{row.getValue("PhoneNumber")}</div>,
  },
  {
    accessorKey: "City",
    header: () => "City",
    cell: ({ row }) => <div>{row.getValue("City")}</div>,
  },
  {
    accessorKey: "Condition",
    header: () => "Condition",
    cell: ({ row }) => <div>{row.getValue("Condition")}</div>,
  },
  {
    accessorKey: "Treatment",
    header: () => "Treatment",
    cell: ({ row }) => <div>{row.getValue("Treatment")}</div>,
  },
  {
    accessorKey: "LeadStatusName",
    header: () => "Status",
    cell: ({ row }) => (
      <Badge
        className={`${
          row.getValue("LeadStatusName") === "Assigned"
            ? "border-blue-500 bg-blue-100 text-blue-500"
            : "border-red-500 bg-red-100 text-red-500"
        }`}
      >
        {row.getValue("LeadStatusName")}
      </Badge>
    ),
  },
  {
    accessorKey: "AssignedToName",
    header: () => "Assigned To",
    cell: ({ row }) => <div>{row.getValue("AssignedToName")}</div>,
  },
  {
    id: "actions",
    header: () => "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <AddLeadForm type="edit" patient={row.original} />
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {getPatientPrescription(row.original)}}>
                Generate Prescription
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <ScheduleAppointmentForm patient={row.original} />
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <PatientInfo title="Patient Information" patient={row.original} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const appointmentsColumns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "Name",
    header: "Name",
    cell: ({ row }) => <div className="capitalize">{row.getValue("Name")}</div>,
  },
  {
    accessorKey: "Age",
    header: "Age",
    cell: ({ row }) => <div>{row.getValue("Age")}</div>,
  },
  {
    accessorKey: "Gender",
    header: () => "Gender",
    cell: ({ row }) => <div>{row.getValue("Gender")}</div>,
  },
  {
    accessorKey: "AppointmentDate",
    header: "Date",
    cell: ({ row }) => <div>{row.getValue("AppointmentDate")}</div>,
  },
  {
    accessorKey: "AppointmentTime",
    header: "Time",
    cell: ({ row }) => <div>{row.getValue("AppointmentTime")}</div>,
  },
  {
    accessorKey: "AppointmentType",
    header: () => "Type",
    cell: ({ row }) => <div>{row.getValue("AppointmentType")}</div>,
  },
  {
    accessorKey: "Status",
    header: () => "Status",
    cell: ({ row }) => (
      <Badge
        className={`${
          row.getValue("Status") === "Confirmed"
            ? "border-blue-500 bg-blue-100 text-blue-500"
            : "border-red-500 bg-red-100 text-red-500"
        }`}
      >
        {row.getValue("Status")}
      </Badge>
    ),
  },
  {
    accessorKey: "Comments",
    header: () => "Comments",
    cell: ({ row }) => <div>{row.getValue("Comments")}</div>,
  },
  {
    id: "actions",
    header: () => "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const [checkoutOpen, setCheckoutOpen] = React.useState(false);
      const [showPackageInvoice, setShowPackageInvoice] = React.useState(false);
      const queryClient = useQueryClient();
      
      const { mutate: checkinPatientMutation } = useMutation({
        mutationFn: checkinPatient,
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["all-appointments"] });
          toast.success("Patient checked in successfully");
        },
        onError: () => {
          toast.error("Failed to check in patient");
        },
      });

      const { mutate: startSessionMutation } = useMutation({
        mutationFn: startSession,
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["all-appointments"] });
          toast.success("Session started successfully");
        },
        onError: () => {
          toast.error("Failed to start session");
        },
      });

      const { mutate: endSessionMutation } = useMutation({
        mutationFn: endSession,
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["all-appointments"] });
          toast.success("Session ended successfully");
        },
        onError: () => {
          toast.error("Failed to end session");
        },
      });

      const handlePatientCheckin = () => {
        checkinPatientMutation({patientId: row.original.PatientId, appointmentId: row.original.AppointmentId});
      }

      const handleStartSession = () =>{
        startSessionMutation(row.original.SessionId)
      }

      const handleEndSession = () =>{
        endSessionMutation(row.original.SessionId)
        setCheckoutOpen(true);
      }
      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                   <AppointmentDetail
                appointment={row.original}
                patient={row.original}
              />
              </DropdownMenuItem>
              {row.original.Status !== "Cancelled" && !row.original.IsPatientCheckedIn && <DropdownMenuItem asChild> 
                <RescheduleConfirmAppointmentForm appointment={row.original} />
              </DropdownMenuItem>}
              {row.original.Status !== "Cancelled" && !row.original.IsPatientCheckedIn &&
                <DropdownMenuItem asChild>
                  <CancelAppointmentForm appointment={row.original} />
                </DropdownMenuItem>}
              {row.original.Status === "Confirmed" && !row.original.IsPatientCheckedIn ? <DropdownMenuItem onClick = {handlePatientCheckin}>Checkin Patient</DropdownMenuItem>: null}
              {(row.original.Status === "Confirmed" && row.original.IsPatientCheckedIn && !row.original.StartTime) ? <DropdownMenuItem onClick ={handleStartSession} >Start Session</DropdownMenuItem>: null}
              {(row.original.Status === "Confirmed" && row.original.StartTime && !row.original.EndTime) ? <DropdownMenuItem onClick = {handleEndSession} >End Session</DropdownMenuItem>: null}
              {(row.original.Status === "Confirmed" && row.original.EndTime && !row.original.IsInvoiceGenerated) ? 
              <DropdownMenuItem asChild >
                <CheckoutPatientForm session={row.original} open={checkoutOpen} onOpenChange={setCheckoutOpen} />
              </DropdownMenuItem>: null}
              {(row.original.IsInvoiceGenerated) ? <DropdownMenuItem onClick ={()=>setShowPackageInvoice(true)} > View invoice </DropdownMenuItem>: null}
            </DropdownMenuContent>
          </DropdownMenu>
          {checkoutOpen && <CheckoutPatientForm session={row.original} open={checkoutOpen} onOpenChange={setCheckoutOpen} setShowPackageInvoice = {setShowPackageInvoice} />}
          {showPackageInvoice && <PackageInvoice appointment={row.original} open={showPackageInvoice} onOpenChange={setShowPackageInvoice} />}
        </>
      );
    },
  },
];

export const packagesColumns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "Name",
    header: "Package Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("Name")}</div>
    ),
  },
  {
    accessorKey: "ChargePerSession",
    header: "Charge Per Session",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("ChargePerSession"));
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(amount);
      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "ChargePerSessionForPackage",
    header: "Charge Per Session For Package",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("ChargePerSessionForPackage"));
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(amount);
      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "TotalSessions",
    header: "Total Sessions",
    cell: ({ row }) => <div>{row.getValue("TotalSessions")}</div>,
  },
  {
    accessorKey: "TotalCost",
    header: "Total Cost",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("TotalCost"));
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(amount);
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const queryClient = useQueryClient();

      const { mutate: deletePackageMutation } = useMutation({
        mutationFn: deletePackage,
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["packages"] });
          toast.success("Package deleted successfully");
        },
        onError: () => {
          toast.error("Failed to delete package");
        },
      });

      const handleDelete = () => {
        deletePackageMutation(row.original.Id);
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <AddPackageForm type="edit" packageData={row.original} />
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete}>
              Delete Package
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const sessionTypesColumns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "SessionName",
    header: "Session Type Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("SessionName")}</div>
    ),
  },
  {
    accessorKey: "ChargePerSession",
    header: "Charge Per Session",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("ChargePerSession"));
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(amount);
      return <div>{formatted}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const queryClient = useQueryClient();

      const { mutate: deleteSessionTypeMutation } = useMutation({
        mutationFn: deleteSessionType,
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["sessionTypes"] });
          toast.success("Session Type deleted successfully");
        },
        onError: () => {
          toast.error("Failed to delete session type");
        },
      });

      const handleDelete = () => {
        deleteSessionTypeMutation(row.original.Id);
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <AddSessionTypeForm type="edit" sessionTypeData={row.original} />
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete}>
              Delete Session Type
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
      
    },
  },
];

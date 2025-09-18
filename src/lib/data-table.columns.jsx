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
    accessorKey: "SourceName",
    header: () => "Source",
    cell: ({ row }) => <div>{row.getValue("SourceName")}</div>,
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
            <DropdownMenuItem>Assigned Lead</DropdownMenuItem>
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
    accessorKey: "LastVisit",
    header: () => "Last Visit",
    cell: ({ row }) => <div>{row.getValue("LastVisit")}</div>,
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
            <DropdownMenuItem>Edit Patient</DropdownMenuItem>
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
              <PatientInfo
                title="Appointment Information"
                patient={row.original}
              />
            </DropdownMenuItem>
            <DropdownMenuItem>Reschedule Appointment</DropdownMenuItem>
            <DropdownMenuItem>Cancel Appointment</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

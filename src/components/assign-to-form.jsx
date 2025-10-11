import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { updatePatientLeads } from "../services/leads-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Simple schema for just the assignedTo field
const assignToSchema = z.object({
  assignedTo: z.string().min(1, "Please select a clinic"),
});

const AssignToForm = ({ patient, disabled = false }) => {
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(assignToSchema),
    defaultValues: {
      assignedTo: patient?.AssignedTo?.toString() || "",
    },
  });

  const queryClient = useQueryClient();
  
  const { mutate: assignLead, isPending } = useMutation({
    mutationFn: updatePatientLeads,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient-leads"] });
      toast.success("Lead Assigned Successfully");
      setOpen(false);
      form.reset();
    },
    onError: (error) => {
      console.error("Assignment error:", error);
      toast.error("Lead Failed to Assign");
    },
  });

  function onSubmit(values) {
    const assignPayload = {
      ...values,
      id: patient.Id || patient.PatientId,
      leadStatus: "2", // Set status to "Assigned"
      assignedTo: values.assignedTo === "" ? null : values.assignedTo,
    };
    
    assignLead(assignPayload);
  }

  const handleCancel = () => {
    form.reset({
      assignedTo: patient?.AssignedTo?.toString() || "",
    });
    console.log("Form reset to original values");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        disabled={disabled}
        className="w-full py-1.5 px-2 flex hover:bg-accent font-normal text-sm rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Assign Lead
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Lead</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              console.log("validation errors", errors);
            })}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="assignedTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assigned To</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Clinic" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">CR Park</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Assigning..." : "Assign Lead"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AssignToForm;

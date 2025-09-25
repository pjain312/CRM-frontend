import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
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
import { IconPlus } from "@tabler/icons-react";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { leadFormSchema } from "../lib/form-validation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { addPatientLead } from "../services/leads-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const AddLeadForm = ({ type, patient }) => {
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: patient?.Name || "",
      age: patient?.Age || "",
      gender: patient?.GenderId || "",
      email: patient?.Email || "",
      phoneNumber: patient?.PhoneNumber || "",
      address: patient?.Address || "",
      city: patient?.City || "",
      state: patient?.State || "",
      pincode: patient?.Pincode || "",
      country: patient?.Country || "",
      leadType: patient?.LeadType || "",
      physioPreference: patient?.PhysioPreferenceName || "",
      leadSource: patient?.LeadSource || "",
      leadStatus: patient?.LeadStatus || "",
      condition: patient?.Condition || "",
      treatment: patient?.Treatment || "",
      assignedTo: "",
    },
  });

  const queryClient = useQueryClient();
  const { mutate: addLead } = useMutation({
    mutationFn: addPatientLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient-leads"] });
      toast.success("Lead Added Successfully");
      setOpen(false);
    },
    onError: () => {
      toast.error("Lead Failed to Add");
    },
  });

  const { mutate: editLead } = useMutation({
    mutationFn: addPatientLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient-leads"] });
      toast.success("Lead Edited Successfully");
      setOpen(false);
    },
    onError: () => {
      toast.error("Lead Failed to Edit");
    },
  });

  function onSubmit(values) {
    if (type === "edit") {
      editLead(values);
    } else {
      addLead(values);
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={` ${
          type === "edit"
            ? "w-full py-1.5 px-2 flex hover:bg-accent font-normal  text-sm rounded-sm "
            : ""
        }`}
      >
        {type === "edit" ? (
          "Edit Patient"
        ) : (
          <div className="flex items-center hover:bg-accent text-sm border px-2 py-2 lg:py-1.5 rounded-sm gap-1">
            <IconPlus size={16} />
            <span className="hidden lg:inline">Add Lead</span>
          </div>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[525px] lg:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>
            {type === "edit" ? "Edit Patient" : "Add New Lead"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              console.log("validation errors", errors);
            })}
            className="grid grid-cols-2 gap-3"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter age" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">Male</SelectItem>
                      <SelectItem value="2">Female</SelectItem>
                      <SelectItem value="3">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+91" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="New Delhi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input placeholder="Delhi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pincode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pincode</FormLabel>
                  <FormControl>
                    <Input placeholder="110001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder="India" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="leadType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">Home</SelectItem>
                      <SelectItem value="2">Clinic</SelectItem>
                      <SelectItem value="3">Not Applicable</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="physioPreference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Physio Preference</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Preference" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">Physiotherapist</SelectItem>
                      <SelectItem value="2">Male Physiotherapist</SelectItem>
                      <SelectItem value="3">Female Physiotherapist</SelectItem>
                      <SelectItem value="4">Chiropractor</SelectItem>
                      <SelectItem value="5">Male Chiropractor</SelectItem>
                      <SelectItem value="6">Female Chiropractor</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="leadSource"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Source</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Source" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">Digital</SelectItem>
                      <SelectItem value="2">Reference</SelectItem>
                      <SelectItem value="3">Walk In</SelectItem>
                      <SelectItem value="4">Just Dial</SelectItem>
                      <SelectItem value="5">Practo</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="leadStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">Active</SelectItem>
                      <SelectItem value="2">Assigned</SelectItem>
                      <SelectItem value="3">Hold On</SelectItem>
                      <SelectItem value="4">Closed</SelectItem>
                      <SelectItem value="5">Assigned To Freelancer</SelectItem>
                      <SelectItem value="6">Not Applicable</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="condition"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Chief Complaint</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter chief complaint" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="treatment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Treatment</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Treatment" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">Physiotherapy</SelectItem>
                      <SelectItem value="2">Chiropractic</SelectItem>
                      <SelectItem value="3">Cupping Therapy</SelectItem>
                      <SelectItem value="4">Dry Needling</SelectItem>
                      <SelectItem value="5">Sports Massage</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <DialogFooter className="col-span-2">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">
                {type === "edit" ? "Edit" : "Add"} Lead
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddLeadForm;

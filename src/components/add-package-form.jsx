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
import { packageFormSchema } from "../lib/form-validation";
import { addPackage, updatePackage } from "../services/packages-service";
import { useQueryClient } from "@tanstack/react-query";
import { useSubmitMutation } from "../hooks/use-submit-mutation";
import { toast } from "sonner";

const AddPackageForm = ({ type, packageData }) => {
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(packageFormSchema),
    defaultValues: {
      packageName: packageData?.Name || "",
      chargePerSession: packageData?.ChargePerSession || "",
      totalSession: packageData?.TotalSessions || "",
      totalCost: packageData?.TotalCost || "",
      chargePerSessionForPackage: packageData?.ChargePerSessionForPackage || "",
      freeSessions: packageData?.FreeSessions || "0",
    },
  });

  const queryClient = useQueryClient();
  const { submit: submitAddPackage, isSubmitting: isAdding } = useSubmitMutation({
    mutationFn: addPackage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      toast.success("Package Added Successfully");
      setOpen(false);
      form.reset();
    },
    onError: () => {
      toast.error("Package Failed to Add");
    },
  });

  const { submit: submitEditPackage, isSubmitting: isEditing } = useSubmitMutation({
    mutationFn: ({ id, ...data }) => updatePackage({ packageId: id, ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      toast.success("Package Edited Successfully");
      setOpen(false);
    },
    onError: () => {
      toast.error("Package Failed to Edit");
    },
  });

  const isSubmitting = isAdding || isEditing;

  function onSubmit(values) {
    if (type === "edit") {
      submitEditPackage({ id: packageData.Id, ...values });
    } else {
      submitAddPackage(values);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={` ${
          type === "edit"
            ? "w-full py-1.5 px-2 flex hover:bg-accent font-normal text-sm rounded-sm"
            : ""
        }`}
      >
        {type === "edit" ? (
          "Edit Package"
        ) : (
          <div className="flex items-center hover:bg-accent text-sm border px-2 py-2 lg:py-1.5 rounded-sm gap-1">
            <IconPlus size={16} />
            <span className="hidden lg:inline">Add Package</span>
          </div>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[525px] lg:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>
            {type === "edit" ? "Edit Package" : "Add New Package"}
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
              name="packageName"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Package Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter package name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="chargePerSession"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Charge Per Session</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Enter charge per session" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
           <FormField
              control={form.control}
              name="chargePerSessionForPackage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Charge Per Session For Package</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Enter charge per session for package" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="totalSession"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Sessions</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Enter total sessions" 
                      min = {0}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="freeSessions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Free Sessions</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Enter number of free sessions (optional)" 
                      min = {0}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="totalCost"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Total Cost</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Enter total cost" 
                      {...field} 
                    />
                  </FormControl>
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
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? (type === "edit" ? "Updating..." : "Adding...")
                  : `${type === "edit" ? "Update" : "Add"} Package`}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPackageForm;

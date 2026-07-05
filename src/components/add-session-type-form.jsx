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
import { sessionTypeFormSchema } from "../lib/form-validation";
import { addSessionType, updateSessionType } from "../services/packages-service";
import { useQueryClient } from "@tanstack/react-query";
import { useSubmitMutation } from "../hooks/use-submit-mutation";
import { toast } from "sonner";

const AddSessionTypeForm = ({ type, sessionTypeData }) => {
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(sessionTypeFormSchema),
    defaultValues: {
      sessionName: sessionTypeData?.SessionName || "",
      chargePerSession: sessionTypeData?.ChargePerSession || "",
    },
  });

  const queryClient = useQueryClient();
  const { submit: submitAddSessionType, isSubmitting: isAdding } = useSubmitMutation({
    mutationFn: addSessionType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessionTypes"] });
      toast.success("Session Type Added Successfully");
      setOpen(false);
      form.reset();
    },
    onError: () => {
      toast.error("Session Type Failed to Add");
    },
  });

  const { submit: submitEditSessionType, isSubmitting: isEditing } = useSubmitMutation({
    mutationFn: ({ id, ...data }) => updateSessionType({ sessionId: id, ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessionTypes"] });
      toast.success("Session Type Edited Successfully");
      setOpen(false);
    },
    onError: () => {
      toast.error("Session Type Failed to Edit");
    },
  });

  const isSubmitting = isAdding || isEditing;

  function onSubmit(values) {
    if (type === "edit") {
      submitEditSessionType({ id: sessionTypeData.Id, ...values });
    } else {
      submitAddSessionType(values);
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
          "Edit Session Type"
        ) : (
          <div className="flex items-center hover:bg-accent text-sm border px-2 py-2 lg:py-1.5 rounded-sm gap-1">
            <IconPlus size={16} />
            <span className="hidden lg:inline">Add Session Type</span>
          </div>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[525px] lg:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>
            {type === "edit" ? "Edit Session Type" : "Add New Session Type"}
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
              name="sessionName"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Session Type Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter session type name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="chargePerSession"
              render={({ field }) => (
                <FormItem className="col-span-2">
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
            <DialogFooter className="col-span-2">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? (type === "edit" ? "Updating..." : "Adding...")
                  : `${type === "edit" ? "Update" : "Add"} Session Type`}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSessionTypeForm;

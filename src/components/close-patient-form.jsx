import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { closePatientFormSchema } from "../lib/form-validation";
import { closePatient } from "../services/leads-service";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "./ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

const ClosePatientForm = ({ leadData}) => {
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(closePatientFormSchema),
    defaultValues: {
        closeReason: "",
    },
  });

  const queryClient = useQueryClient();
  const { mutate: closePatientMutation } = useMutation({
    mutationFn: closePatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient-leads"] });
      toast.success("Patient Closed Successfully");
      setOpen(false);
      form.reset();
    },
    onError: () => {
      toast.error("Patient Failed to Close");
    },
  });

  function onSubmit(values) {
    closePatientMutation({...values, patientId: leadData.Id})
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="flex px-2 hover:bg-accent font-normal py-1.5 text-sm rounded-sm">
        Close Patient
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[525px] lg:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>
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
              name="closeReason"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Reason for Closing</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Reason for Closing" {...field} />
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
              <Button type="submit">
                Close Patient
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ClosePatientForm;

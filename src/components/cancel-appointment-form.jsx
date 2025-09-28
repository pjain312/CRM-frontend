import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { cancelAppointmentFormSchema } from "../lib/form-validation";
import { updateAppointment } from "../services/appointment-service";
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
import { Textarea } from "./ui/textarea";

import { toast } from "sonner";

const CancelAppointmentForm = ({ appointment, notDialogTrigger, openIcon, onOpenIconChange}) => {
  const [open, setOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(cancelAppointmentFormSchema),
    defaultValues: {
      status: "3",
      comments: "",
    },
  });

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: updateAppointment,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["all-appointments"] }),
        queryClient.invalidateQueries({ queryKey: ["appointment-today"] }),
      ]);
      toast.success(`Appointment Cancelled Successfully`);
      setOpen(false);
      if (onOpenIconChange) onOpenIconChange(false);
    },
    onError: () => {
      toast.error(`Appointment Failed to Cancelled`);
    },
  });
  
  function onSubmit(values) {
    mutate({ ...values, appointmentId: appointment.AppointmentId, status: "3" });
  }

  const setDialogOpen = () => {
    setOpen(false)
    if(onOpenIconChange) onOpenIconChange(false)
  }

  return (
    <Dialog open={open || openIcon} onOpenChange={setDialogOpen}>
      {!notDialogTrigger && <DialogTrigger className="flex px-2 hover:bg-accent font-normal py-1.5 text-sm rounded-sm">
        Cancel Appointment
      </DialogTrigger>}
      <DialogContent className="sm:max-w-[425px] md:max-w-[525px] lg:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Cancel Appointment</DialogTitle>
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
              name="comments"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Comments</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={"Reason of cancellation"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="col-span-2">
              <DialogClose asChild>
                <Button
                  className="cursor-pointer"
                  type="button"
                  variant="outline"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button className="cursor-pointer" type="submit">
                Cancel Appointment
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CancelAppointmentForm;

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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { appointmentFormSchema } from "../lib/form-validation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { Textarea } from "./ui/textarea";
import DatePicker from "./date-picker";
import { TimePicker } from "./time-picker";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addAppointment, getAppointmentDefaultOptions } from "../services/appointment-service";

import { toast } from "sonner";

const ScheduleAppointmentForm = ({ patient, openIcon, onOpenIconChange, notDialogTrigger }) => {
  const [open, setOpen] = useState(false);

  const { data: appointmentDefaultOptions } = useQuery({
    queryKey: ["appointment-default-options"],
    queryFn: getAppointmentDefaultOptions,
  });

  console.log(appointmentDefaultOptions)
  const form = useForm({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      appointmentDate: "",
      appointmentTime: "",
      appointmentType: "",
      status: "",
      comments: "",
    },
  });

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: addAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient-appointments"] });
      toast.success("Appointment Scheduled Successfully");
      setOpen(false);
      onOpenIconChange && onOpenIconChange(false)
    },
    onError: () => {
      toast.error("Appointment Failed to Schedule");
    },
  });

  function onSubmit(values) {
    mutate({ ...values, patientId: patient.Id });
  }

  const handleDialogClose = () =>{
    setOpen(false);
    onOpenIconChange && onOpenIconChange(false)
  }

  return (
    <Dialog open={open || openIcon} onOpenChange={handleDialogClose}>
      {!notDialogTrigger && 
        <DialogTrigger className="flex px-2 hover:bg-accent font-normal py-1.5 text-sm rounded-sm">
          Schedule Appointment
        </DialogTrigger>
      }
      <DialogContent className="sm:max-w-[425px] md:max-w-[525px] lg:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Schedule Appointment</DialogTitle>
          <DialogDescription>
            Sehedule an appointment for a patient.
          </DialogDescription>
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
              name="appointmentDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <DatePicker
                          date={field.value}
                          onDateChange={field.onChange}
                          placeholder="Select event date"
                          className="w-full"
                        />
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="appointmentTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time</FormLabel>
                  <FormControl>
                    <TimePicker
                      time={field.value}
                      onTimeChange={field.onChange}
                      placeholder="Select event time"
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="appointmentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Appointment Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">Consultation</SelectItem>
                      <SelectItem value="2">Treatment</SelectItem>
                      <SelectItem value="3">Assessment</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
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
                      {appointmentDefaultOptions?.appointmentStatusList?.map(a=>{
                        return <SelectItem value={a.Id?.toString()}>{a.Name}</SelectItem>
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Comments</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter any additional notes for this appointment"
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
                Schedule Appointment
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleAppointmentForm;

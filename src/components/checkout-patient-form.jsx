import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { checkoutPatientFormSchema } from "../lib/form-validation";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";

import { DialogTrigger } from "@radix-ui/react-dialog";
import { checkoutPatient, getAllPackagesAndSessionTypes, getPatientDetailsForCheckout } from "../services/session-service";

const CheckoutPatientForm = ({ session, open, onOpenChange, notDialogTrigger, setShowPackageInvoice }) => {
  const [isFullAmountSelected, setIsFullAmountSelected] = useState(false);


  const { data: patientCheckoutDetails } = useQuery({
    queryKey: ["patient-checkout-details"],
    queryFn: () =>
        getPatientDetailsForCheckout({ sessionId: session.SessionId }),
  });

  const { data: patientCheckoutDefaults } = useQuery({
    queryKey: ["patient-checkout-defaults"],
    queryFn: () =>
        getAllPackagesAndSessionTypes(),
  });

  const form = useForm({
    resolver: zodResolver(checkoutPatientFormSchema),
    defaultValues: {
      packageId: "",
      sessionCharges: "",
      paymentMode: "",
      sessionTypes: [],
    },
  });

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: checkoutPatient,
    onSuccess: async () => {
        // await Promise.all([
        //     queryClient.invalidateQueries({ queryKey: ["patient-checkout-details"]}),
        //     queryClient.invalidateQueries({ queryKey: ["all-appointments"]}),
        //     queryClient.invalidateQueries({ queryKey: ["appointment-today"]}),
        //   ]);
    //   toast.success("Patient CheckedOut Successfully");
      onOpenChange(false);
      if(!patientCheckoutDetails?.PackageId && form.watch("packageId")) setShowPackageInvoice(true)
    },
    onError: () => {
      toast.error("Patient Failed to Checkout");
    },
  });

  const handlePayFullAmount = () => {
    const selectedPackage = patientCheckoutDefaults?.packages?.find(p => p.Id.toString() === form.getValues("packageId"));
    if (selectedPackage) {
      form.setValue("sessionCharges", selectedPackage.TotalCost.toString());
      setIsFullAmountSelected(true);
    }
  };

  function onSubmit(values) {
    let checkoutData;
    if(patientCheckoutDetails?.PackageId){
      checkoutData = {
        sessionId: session.SessionId,
      };
    } else if(!patientCheckoutDetails?.PackageId && values.packageId) {
      checkoutData = {
        sessionId: session.SessionId,
        packageId: values.packageId,
        sessionCharges: values.sessionCharges ? parseFloat(values.sessionCharges) : 0,
        paymentMode: values.paymentMode,
      };
    }
    else if(!patientCheckoutDetails?.PackageId && values.sessionTypes?.length) {
      checkoutData = {
        sessionId: session.SessionId,
        sessionCharges: values.sessionCharges ? parseFloat(values.sessionCharges) : 0,
        paymentMode: values.paymentMode,
      };
    }
    mutate(checkoutData);
  }

  return (
    <>
        <Dialog open={open} onOpenChange={onOpenChange}>
        { !notDialogTrigger && <DialogTrigger className="flex px-2 hover:bg-accent font-normal py-1.5 text-sm rounded-sm">
            Checkout Patient
            </DialogTrigger>}
        <DialogContent className="sm:max-w-[425px] md:max-w-[525px] lg:max-w-[625px]">
            <DialogHeader>
            <DialogTitle>Checkout Patient</DialogTitle>
            <DialogDescription>
            </DialogDescription>
            </DialogHeader>
            
            {/* Patient Details Section */}
            {patientCheckoutDetails && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Patient Information</h3>
                <div className="grid grid-cols-2 gap-4">
                <div>
                    <span className="text-sm font-medium text-gray-600">Name:</span>
                    <p className="text-sm">{patientCheckoutDetails.PatientName || 'N/A'}</p>
                </div>
                <div>
                    <span className="text-sm font-medium text-gray-600">Gender:</span>
                    <p className="text-sm">{patientCheckoutDetails.Gender || 'N/A'}</p>
                </div>
                <div>
                    <span className="text-sm font-medium text-gray-600">Age:</span>
                    <p className="text-sm">{`${patientCheckoutDetails.Age} years`|| 'N/A'}</p>
                </div>
                <div>
                    <span className="text-sm font-medium text-gray-600">Session Duration</span>
                    <p className="text-sm">{ `${patientCheckoutDetails.SessionStartTime} - ${patientCheckoutDetails.SessionEndTime} (${patientCheckoutDetails.SessionDuration} minutes)`|| 'N/A'}</p>
                </div>
                {patientCheckoutDetails?.PackageId ? <>
                
                    <div>
                        <span className="text-sm font-medium text-gray-600">Package:</span>
                        <p className="text-sm">{patientCheckoutDetails.PackageName || 'N/A'}</p>
                    </div>
                    <div>
                        <span className="text-sm font-medium text-gray-600">Sessions Left:</span>
                        <p className="text-sm">{patientCheckoutDetails.TotalPackageSessions - patientCheckoutDetails.TotalPackageSessionsUsed || 'N/A'}</p>
                    </div>
                </>
                : null}
                </div>
            </div>
            )}
            
            <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit, (errors) => {
                console.log("validation errors", errors);
                })}
                className="grid grid-cols-2 gap-3"
            >
                {!patientCheckoutDetails?.PackageId ?
            
                <>
            
                <FormField
                control={form.control}
                name="packageId"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Assign a Package</FormLabel>
                    <Select onValueChange={(value) => {
                        field.onChange(value);
                        setIsFullAmountSelected(false);
                        form.setValue("sessionCharges", "");
                        form.setValue("sessionTypes", []);
                    }} value={field.value}>
                        <FormControl>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Package" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {patientCheckoutDefaults?.packages?.map((packageItem) => {
                            return <SelectItem key={packageItem.Id} value={packageItem.Id?.toString()}>{packageItem.Name}</SelectItem>
                        })}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="sessionTypes"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Select Session Types</FormLabel>
                    <Select 
                        onValueChange={(value) => {
                        const currentValues = field.value || [];
                        if (currentValues.includes(value)) {
                            // Remove if already selected
                            field.onChange(currentValues.filter((id) => id !== value));
                        } else {
                            // Add if not selected
                            field.onChange([...currentValues, value]);
                        }
                        let sessionCharges = 0;
                        patientCheckoutDefaults?.sessionTypes?.forEach((session) => {
                            if ([...currentValues, value]?.includes(session.Id.toString())) {
                            sessionCharges += session.ChargePerSession;
                            }
                        });
                        form.setValue("sessionCharges", sessionCharges.toString());
                        form.setValue("packageId", "");
                        }} 
                        value=""
                    >
                        <FormControl>
                        <SelectTrigger className="w-full">
                            <div className="flex flex-wrap gap-1 items-center">
                            {field.value && field.value.length > 0 ? (
                                field.value.map((sessionId) => {
                                const session = patientCheckoutDefaults?.sessionTypes?.find(s => s.Id.toString() === sessionId);
                                return (
                                    <span
                                    key={sessionId}
                                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                    >
                                    {session?.SessionName}
                                    </span>
                                );
                                })
                            ) : (
                                <span className="text-muted-foreground">Select Session Types</span>
                            )}
                            </div>
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {patientCheckoutDefaults?.sessionTypes?.map((session) => {
                            const isSelected = field.value?.includes(session.Id.toString());
                            return (
                            <SelectItem 
                                key={session.Id} 
                                value={session.Id?.toString()}
                                className={isSelected ? "bg-blue-50" : ""}
                            >
                                <div className="flex items-center space-x-2">
                                <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-blue-500' : 'bg-gray-300'}`}></span>
                                <span>{session.SessionName}</span>
                                </div>
                            </SelectItem>
                            );
                        })}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                
                {!!(form.watch("packageId") || form.watch("sessionTypes")?.length) && !patientCheckoutDetails?.PackageId && (
                <FormField
                    control={form.control}
                    name="sessionCharges"
                    render={({ field }) => (
                    <FormItem className="col-span-2">
                        <FormLabel>Advance Payment Amount (₹)</FormLabel>
                        <FormControl>
                        <Input
                            type="number"
                            placeholder="Enter amount paid in advance"
                            disabled={isFullAmountSelected || form.watch("sessionTypes")?.length}
                            {...field}
                        />
                        </FormControl>
                        {!isFullAmountSelected && form.watch("packageId") && (
                        <p 
                            className="text-sm text-blue-600 cursor-pointer hover:text-blue-800 underline"
                            onClick={handlePayFullAmount}
                        >
                            Pay full amount
                        </p>
                        )}
                        <FormMessage />
                    </FormItem>
                    )}
                />
                )}

                {!!(form.watch("packageId") || form.watch("sessionTypes")?.length) && !patientCheckoutDetails?.PackageId && (
                <FormField
                    control={form.control}
                    name="paymentMode"
                    render={({ field }) => (
                    <FormItem className="col-span-2">
                        <FormLabel>Mode of Payment</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Mode of Payment" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {patientCheckoutDefaults?.paymentModes?.map((paymentModes) => {
                            return <SelectItem key={paymentModes.Id} value={paymentModes.Id?.toString()}>{paymentModes.Name}</SelectItem>
                        })}
                        </SelectContent>
                    </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                )}
                </>
                :
                null
            }
            
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
                    Checkout Patient
                </Button>
                </DialogFooter>
            </form>
            </Form>
        </DialogContent>
        </Dialog>
    </>
  );
};

export default CheckoutPatientForm;

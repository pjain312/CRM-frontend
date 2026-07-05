import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSubmitMutation } from "../hooks/use-submit-mutation";
import React, { useState, useEffect, useRef } from "react";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";

import { DialogTrigger } from "@radix-ui/react-dialog";
import { checkoutPatient, getAllPackagesAndSessionTypes, getPatientDetailsForCheckout } from "../services/session-service";
import { getPackageCheckoutWhatsAppPrompt, openWhatsAppUrl } from "../lib/whatsapp-utils";
import { toast } from "sonner";

const CheckoutPatientForm = ({ session, open, onOpenChange, notDialogTrigger, setShowPackageInvoice, setShowDailyInvoice }) => {
  const [isFullAmountSelected, setIsFullAmountSelected] = useState(false);
  const [checkoutOption, setCheckoutOption] = useState("package"); // "package" or "sessionTypes"
  const [whatsAppPrompt, setWhatsAppPrompt] = useState(null);
  const [whatsAppStep, setWhatsAppStep] = useState("review");
  const packageWhatsAppRef = useRef(null);

  const closeWhatsAppFlow = () => {
    setWhatsAppPrompt(null);
    setWhatsAppStep("review");
    onOpenChange(false);
  };

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

  // Reset form and checkout option when dialog opens
  useEffect(() => {
    if (open && patientCheckoutDetails?.PackageId) {
      setCheckoutOption("package");
      form.reset({
        packageId: "",
        sessionCharges: "",
        paymentMode: "",
        sessionTypes: [],
      });
      setIsFullAmountSelected(false);
    }
  }, [open, patientCheckoutDetails?.PackageId, form]);

  const queryClient = useQueryClient();
  const { submit, isSubmitting } = useSubmitMutation({
    mutationFn: checkoutPatient,
    onSuccess: async () => {
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: ["patient-checkout-details"]}),
            queryClient.invalidateQueries({ queryKey: ["all-appointments"]}),
            queryClient.invalidateQueries({ queryKey: ["appointment-today"]}),
          ]);
      toast.success("Patient CheckedOut Successfully");
    if(!patientCheckoutDetails?.PackageId && form.watch("packageId")) setShowPackageInvoice(true)
    if(form.watch("sessionTypes")?.length) setShowDailyInvoice(true)

    const whatsAppDetails = packageWhatsAppRef.current;
    packageWhatsAppRef.current = null;

    if (whatsAppDetails) {
      const prompt = getPackageCheckoutWhatsAppPrompt(whatsAppDetails);
      if (prompt) {
        setWhatsAppStep("review");
        setWhatsAppPrompt(prompt);
        return;
      }
      toast.warning("Checkout complete. No valid phone number for WhatsApp.");
    }

    onOpenChange(false);
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
      if(checkoutOption === "package") {
        // Deduct from package
      checkoutData = {
        sessionId: session.SessionId,
      };
      } else if(checkoutOption === "sessionTypes" && values.sessionTypes?.length) {
        // Use session types instead of package
        checkoutData = {
          sessionId: session.SessionId,
          sessionCharges: values.sessionCharges ? parseFloat(values.sessionCharges) : 0,
          paymentMode: values.paymentMode,
          selectedSessionTypes: values.sessionTypes?.toString(),
        };
      } else {
        toast.error("Please select session types");
        return;
      }
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
        selectedSessionTypes: values.sessionTypes?.toString(),
      };
    }

    packageWhatsAppRef.current =
      patientCheckoutDetails?.PackageId && checkoutOption === "package"
        ? {
            ...patientCheckoutDetails,
            PhoneNumber: patientCheckoutDetails.PhoneNumber || session.PhoneNumber,
          }
        : null;

    submit(checkoutData);
  }

  return (
    <>
        <Dialog open={open && !whatsAppPrompt} onOpenChange={onOpenChange}>
            { !notDialogTrigger && <DialogTrigger className="flex px-2 hover:bg-accent font-normal py-1.5 text-sm rounded-sm">
                Checkout Patient
            </DialogTrigger>}
        <DialogContent className="max-w-[95vw] sm:max-w-[425px] md:max-w-[525px] lg:max-w-[625px] max-h-[90vh] overflow-y-auto pb-20 sm:pb-6">
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
                className="grid grid-cols-1 md:grid-cols-2 gap-3"
            >
                {patientCheckoutDetails?.PackageId ? (
                    <>
                        {/* Checkout Option Selection with Tabs */}
                        <div className="col-span-1 md:col-span-2">
                            <Tabs 
                                value={checkoutOption} 
                                onValueChange={(value) => {
                                    if (value) {
                                        setCheckoutOption(value);
                                        // Reset form fields when switching options
                                        form.setValue("sessionTypes", []);
                                        form.setValue("sessionCharges", "");
                                        form.setValue("paymentMode", "");
                                        setIsFullAmountSelected(false);
                                    }
                                }}
                                className="w-full"
                            >
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="package" className="text-sm md:text-base">
                                        Deduct from Package
                                    </TabsTrigger>
                                    <TabsTrigger value="sessionTypes" className="text-sm md:text-base">
                                        Select Session Types
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="package" className="mt-4">
                                    <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0">
                                                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                                    <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Deduct from Package</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    This session will be deducted from the patient's active package. No additional payment required.
                                                </p>
                                                <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800">
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-gray-600 dark:text-gray-400">Package:</span>
                                                        <span className="font-medium text-gray-900 dark:text-gray-100">{patientCheckoutDetails.PackageName}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-sm mt-2">
                                                        <span className="text-gray-600 dark:text-gray-400">Sessions Remaining:</span>
                                                        <span className="font-medium text-green-600 dark:text-green-400">
                                                            {patientCheckoutDetails.TotalPackageSessions - patientCheckoutDetails.TotalPackageSessionsUsed}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="sessionTypes" className="mt-4">
                                    <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800 mb-4">
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0">
                                                <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                                    <svg className="h-5 w-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Select Session Types</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Choose specific session types for this appointment. Payment will be required based on selected types.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Session Types Selection */}
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
                                                            const updatedValues = currentValues.includes(value) 
                                                                ? currentValues.filter((id) => id !== value)
                                                                : [...currentValues, value];
                                                            if (updatedValues?.includes(session.Id.toString())) {
                                                                sessionCharges += session.ChargePerSession;
                                                            }
                                                        });
                                                        form.setValue("sessionCharges", sessionCharges.toString());
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

                                    {form.watch("sessionTypes")?.length > 0 && (
                                        <div className="space-y-4 mt-4">
                                            <FormField
                                                control={form.control}
                                                name="sessionCharges"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Session Charges (₹)</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                placeholder="Enter session charges"
                                                                disabled={true}
                                                                className="font-semibold text-lg"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="paymentMode"
                                                render={({ field }) => (
                                                    <FormItem>
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
                                        </div>
                                    )}
                                </TabsContent>
                            </Tabs>
                        </div>
                    </>
                ) : (
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
                )
            }
            
                <DialogFooter className="col-span-1 md:col-span-2 flex-col sm:flex-row gap-2 sm:gap-0 pb-6 sm:pb-0 mb-safe sm:mb-0">
                <DialogClose asChild>
                    <Button
                    className="cursor-pointer w-full sm:w-auto"
                    type="button"
                    variant="outline"
                    >
                    Cancel
                    </Button>
                </DialogClose>
                <Button className="cursor-pointer w-full sm:w-auto" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Checking out..." : "Checkout Patient"}
                </Button>
                </DialogFooter>
            </form>
            </Form>
        </DialogContent>
        </Dialog>

        <Dialog
          open={!!whatsAppPrompt}
          onOpenChange={(isOpen) => {
            if (!isOpen) closeWhatsAppFlow();
          }}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {whatsAppStep === "review" ? "Send WhatsApp update" : "Open WhatsApp?"}
              </DialogTitle>
              <DialogDescription>
                {whatsAppStep === "review"
                  ? `Review the session update message for ${whatsAppPrompt?.patientName}.`
                  : `You will be redirected to WhatsApp to send this message to ${whatsAppPrompt?.patientName} (${whatsAppPrompt?.phoneNumber}).`}
              </DialogDescription>
            </DialogHeader>

            {whatsAppStep === "review" ? (
              <>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    To: {whatsAppPrompt?.phoneNumber}
                  </p>
                  <div className="rounded-lg border bg-muted/50 p-3 text-sm whitespace-pre-wrap">
                    {whatsAppPrompt?.message}
                  </div>
                </div>
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button type="button" variant="outline" onClick={closeWhatsAppFlow}>
                    Skip
                  </Button>
                  <Button
                    type="button"
                    className="bg-[#25D366] hover:bg-[#20BD5A] text-white"
                    onClick={() => setWhatsAppStep("confirm")}
                  >
                    Continue to WhatsApp
                  </Button>
                </DialogFooter>
              </>
            ) : (
              <>
                <div className="rounded-lg border bg-muted/50 p-3 text-sm whitespace-pre-wrap max-h-40 overflow-y-auto">
                  {whatsAppPrompt?.message}
                </div>
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button type="button" variant="outline" onClick={() => setWhatsAppStep("review")}>
                    Go back
                  </Button>
                  <Button
                    type="button"
                    className="bg-[#25D366] hover:bg-[#20BD5A] text-white"
                    onClick={() => {
                      if (!whatsAppPrompt?.url) return;
                      openWhatsAppUrl(whatsAppPrompt.url);
                    }}
                  >
                    Yes, open WhatsApp
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
    </>
  );
};

export default CheckoutPatientForm;

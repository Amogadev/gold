'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Calendar as CalendarIcon, Camera, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { SiteHeader } from '@/components/site-header';
import { PageHeader } from '@/components/page-header';
import { useFirestore } from '@/firebase/provider';
import { addDoc, collection } from 'firebase/firestore';

const loanSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required'),
  mobileNumber: z.string().min(10, 'Mobile number must be at least 10 digits'),
  itemName: z.string().min(1, 'Item name is required'),
  itemWeight: z.coerce.number().min(0.1, 'Weight must be greater than 0'),
  loanAmount: z.coerce.number().min(1, 'Loan amount must be greater than 0'),
  interestPercentage: z.coerce
    .number()
    .min(0, 'Interest rate cannot be negative'),
  loanStartDate: z.date({ required_error: 'Loan start date is required.' }),
  loanDueDate: z.date({ required_error: 'Loan due date is required.' }),
});

type LoanFormData = z.infer<typeof loanSchema>;

export default function NewLoanPage() {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | undefined>(undefined);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const { toast } = useToast();
  const db = useFirestore();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoanFormData>({
    resolver: zodResolver(loanSchema),
  });
  
  const getCameraPermission = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setHasCameraPermission(false);
      toast({
        variant: 'destructive',
        title: 'Camera Not Supported',
        description: 'Your browser does not support camera access.',
      });
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      setHasCameraPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraOpen(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasCameraPermission(false);
      toast({
        variant: 'destructive',
        title: 'Camera Access Denied',
        description: 'Please enable camera permissions in your browser settings.',
      });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const takePicture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);
      }
      closeCamera();
    }
  };
  
  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    setIsCameraOpen(false);
  };
  
  useEffect(() => {
    // This effect ensures the camera stream is stopped when the component unmounts.
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const onSubmit = async (data: LoanFormData) => {
    if (!db) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Firestore is not initialized.',
      });
      return;
    }
    setLoading(true);

    try {
      await addDoc(collection(db, 'loans'), {
        ...data,
        loanStartDate: format(data.loanStartDate, 'yyyy-MM-dd'),
        loanDueDate: format(data.loanDueDate, 'yyyy-MM-dd'),
        imageUrl: capturedImage || 'https://images.unsplash.com/photo-1611893452478-3865a737b016?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        imageHint: 'gold jewelry',
        status: 'Active',
        paidAmount: 0,
        pendingBalance: data.loanAmount,
      });

      toast({
        title: 'Success!',
        description: 'New loan has been created successfully.',
      });
      router.push('/loans');
    } catch (error) {
      console.error("Error adding document: ", error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not create the loan. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <PageHeader 
                title="Create New Loan" 
                description="Fill in the details below to create a new gold loan record."
              />
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">Customer Name</Label>
                    <Input
                      id="customerName"
                      {...register('customerName')}
                      placeholder="John Doe"
                    />
                    {errors.customerName && (
                      <p className="text-sm text-destructive">
                        {errors.customerName.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobileNumber">Mobile Number</Label>
                    <Input
                      id="mobileNumber"
                      type="tel"
                      {...register('mobileNumber')}
                      placeholder="9876543210"
                    />
                    {errors.mobileNumber && (
                      <p className="text-sm text-destructive">
                        {errors.mobileNumber.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="itemName">Gold Item Name</Label>
                    <Input
                      id="itemName"
                      {...register('itemName')}
                      placeholder="e.g., Bangle, Ring"
                    />
                    {errors.itemName && (
                      <p className="text-sm text-destructive">
                        {errors.itemName.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="itemWeight">Gold Weight (grams)</Label>
                    <Input
                      id="itemWeight"
                      type="number"
                      step="0.01"
                      {...register('itemWeight')}
                      placeholder="e.g., 10.5"
                    />
                    {errors.itemWeight && (
                      <p className="text-sm text-destructive">
                        {errors.itemWeight.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="loanAmount">Loan Amount ($)</Label>
                    <Input
                      id="loanAmount"
                      type="number"
                      {...register('loanAmount')}
                      placeholder="e.g., 50000"
                    />
                    {errors.loanAmount && (
                      <p className="text-sm text-destructive">
                        {errors.loanAmount.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="interestPercentage">Interest Rate (%)</Label>
                    <Input
                      id="interestPercentage"
                      type="number"
                      step="0.1"
                      {...register('interestPercentage')}
                      placeholder="e.g., 12.5"
                    />
                    {errors.interestPercentage && (
                      <p className="text-sm text-destructive">
                        {errors.interestPercentage.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Loan Start Date</Label>
                    <Controller
                      name="loanStartDate"
                      control={control}
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-full justify-start text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                    {errors.loanStartDate && (
                      <p className="text-sm text-destructive">
                        {errors.loanStartDate.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Loan Due Date</Label>
                    <Controller
                      name="loanDueDate"
                      control={control}
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-full justify-start text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                    {errors.loanDueDate && (
                      <p className="text-sm text-destructive">
                        {errors.loanDueDate.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Gold Item Image (Optional)</Label>
                  <div className="w-full rounded-lg border bg-muted p-4" hidden={!isCameraOpen}>
                    <video
                      ref={videoRef}
                      className="w-full aspect-video rounded-md"
                      autoPlay
                      muted
                    />
                    <div className="mt-4 flex justify-end gap-2">
                      <Button type="button" onClick={takePicture}>
                        <Camera className="mr-2 h-4 w-4" />
                        Take Picture
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={closeCamera}
                      >
                        Close
                      </Button>
                    </div>
                  </div>

                  {capturedImage && (
                    <div className="relative">
                      <img
                        src={capturedImage}
                        alt="Captured gold item"
                        className="w-full rounded-md border"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => {
                            setCapturedImage(null);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                  
                  {!capturedImage && !isCameraOpen && (
                    <div className="flex flex-col items-start gap-4">
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" onClick={getCameraPermission}>
                          <Camera className="mr-2 h-4 w-4" /> Open Camera
                        </Button>
                        <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                          <Upload className="mr-2 h-4 w-4" /> Upload Picture
                        </Button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          className="hidden"
                          accept="image/*"
                        />
                      </div>
                      {hasCameraPermission === false && (
                        <Alert variant="destructive">
                          <AlertTitle>Camera Access Required</AlertTitle>
                          <AlertDescription>
                            Please allow camera access to use this feature.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  )}
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Saving...' : 'Save Loan'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

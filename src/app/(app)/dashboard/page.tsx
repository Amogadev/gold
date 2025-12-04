'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Camera, Upload, DollarSign, List, FileText } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function DashboardPage() {
  const [hasCameraPermission, setHasCameraPermission] = useState<
    boolean | undefined
  >(undefined);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  const getCameraPermission = async () => {
    if (hasCameraPermission) {
      setIsCameraOpen(true);
      return;
    }
    
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setHasCameraPermission(false);
      toast({
        variant: 'destructive',
        title: 'Camera Not Supported',
        description:
          'Your browser does not support camera access. Please try a different browser.',
      });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      streamRef.current = stream;
      setHasCameraPermission(true);
      setIsCameraOpen(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasCameraPermission(false);
      toast({
        variant: 'destructive',
        title: 'Camera Access Denied',
        description:
          'Please enable camera permissions in your browser settings to use this feature.',
      });
    }
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if(videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };
  
  // Cleanup stream on component unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="container mx-auto space-y-8 px-4 sm:px-6 lg:px-8">
      <Card className="border-primary/20 shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Active Loan</CardTitle>
          <CardDescription>
            Here are the details of your active loan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 md:grid-cols-4">
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-muted-foreground">Loan Amount</span>
              <span className="text-xl font-semibold">$10,000</span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-muted-foreground">Interest Rate</span>
              <span className="text-xl font-semibold">5.0%</span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-muted-foreground">Next Payment</span>
              <span className="text-xl font-semibold">July 30, 2024</span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge className="w-fit">Active</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle  className="font-headline text-3xl">Apply for a New Loan</CardTitle>
          <CardDescription>
            Fill out the form below to apply for a new gold loan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="items">Number of Items</Label>
                <div className="relative">
                  <List className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input id="items" type="number" placeholder="e.g., 2" className="pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="loan-amount">How much loan do you need?</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="loan-amount"
                    type="number"
                    placeholder="e.g., 5000"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="particulars">Particulars</Label>
               <div className="relative">
                <FileText className="absolute left-3 top-3 text-muted-foreground" />
                <Textarea
                  id="particulars"
                  placeholder="e.g., 1 gold chain, 1 pair of earrings"
                  rows={3}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label>Gold Image</Label>
              {isCameraOpen ? (
                 <div className="w-full rounded-lg border-2 border-dashed bg-muted p-4">
                  <div className="aspect-video w-full overflow-hidden rounded-md">
                    <video
                      ref={videoRef}
                      className="h-full w-full object-cover"
                      autoPlay
                      muted
                      playsInline
                    />
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                     <Button type="button" className="bg-accent hover:bg-accent/90">
                      <Camera className="mr-2" />
                      Take Picture
                    </Button>
                    <Button type="button" variant="ghost" onClick={closeCamera}>
                      Close
                    </Button>
                  </div>
                </div>
              ) : (
                <Button type="button" variant="outline" onClick={getCameraPermission} className="w-full md:w-auto">
                  <Camera className="mr-2" />
                  Open Camera
                </Button>
              )}
               {hasCameraPermission === false && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertTitle>Camera Access Required</AlertTitle>
                    <AlertDescription>
                      Please allow camera access in your browser to use this
                      feature. You might need to refresh the page after
                      granting permission.
                    </AlertDescription>
                  </Alert>
                )}
            </div>

            <div className="flex justify-end">
              <Button type="submit" size="lg">
                <Upload className="mr-2" />
                Submit Loan Application
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { getRecommendations, type RecommendationsState } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, Wand2 } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Wand2 className="mr-2 h-4 w-4" />
          Get Recommendations
        </>
      )}
    </Button>
  );
}

export function RecommendationsForm() {
  const initialState: RecommendationsState = {};
  const [state, formAction] = useActionState(getRecommendations, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message === "success") {
       toast({
        title: "Recommendations Generated!",
        description: "Your personalized suggestions are ready.",
      });
    } else if (state.message === "error" && state.error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: state.error,
      });
    }
  }, [state, toast]);

  return (
    <section>
      <Card className="shadow-lg border-2 border-primary/20">
        <form ref={formRef} action={formAction}>
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Personalized Recommendations</CardTitle>
            <CardDescription>
              Tell us about your recent activity and interests to receive
              tailored suggestions from our AI.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid w-full gap-2">
              <Label htmlFor="userHistory">Past Activity & Preferences</Label>
              <Textarea
                id="userHistory"
                name="userHistory"
                placeholder="e.g., 'I've been reading a lot about fintech startups and watched a documentary on renewable energy...'"
                rows={4}
                required
              />
            </div>
            <div className="grid w-full gap-2">
              <Label htmlFor="userSegmentation">Which best describes you?</Label>
              <Select name="userSegmentation" defaultValue="tech_enthusiast">
                <SelectTrigger id="userSegmentation">
                  <SelectValue placeholder="Select a segment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tech_enthusiast">Tech Enthusiast</SelectItem>
                  <SelectItem value="investor">Investor</SelectItem>
                  <SelectItem value="creative_professional">Creative Professional</SelectItem>
                  <SelectItem value="founder">Founder</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row items-center justify-between">
             <p className="text-sm text-destructive mb-2 sm:mb-0">
                {state.message === 'error' && state.error}
              </p>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>

      {state.recommendations && (
        <Card className="mt-6 border-dashed border-2 animate-in fade-in-50 duration-500">
           <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center gap-2"><Wand2 className="text-primary"/>Here are your recommendations:</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">
              {state.recommendations}
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  );
}

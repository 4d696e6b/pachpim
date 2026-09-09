"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  FieldError,
  Input,
  Label,
  Textarea,
} from "@/components/ui/form-controls";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(80),
  email: z.email("Enter a valid email address.").max(160),
  subject: z.string().trim().min(3, "Add a subject.").max(120),
  message: z
    .string()
    .trim()
    .min(20, "Please add a little more detail.")
    .max(5000),
  company: z.string().max(200).optional(),
});
type ContactValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      company: "",
    },
  });

  async function onSubmit(values: ContactValues) {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const body = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;
    if (!response.ok) {
      toast.error(body?.message ?? "Your message could not be sent.");
      return;
    }
    reset();
    setSubmitted(true);
    toast.success("Message sent. Thank you.");
  }

  if (submitted) {
    return (
      <div
        className="border-accent/25 bg-accent/5 rounded-3xl border p-8"
        role="status"
      >
        <h2 className="text-xl font-semibold">Your message is on its way.</h2>
        <p className="text-muted-foreground mt-3 leading-7">
          Thanks for reaching out. I’ll respond as soon as I can.
        </p>
        <Button
          className="mt-6"
          onClick={() => setSubmitted(false)}
          variant="outline"
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="hidden" aria-hidden>
        <Label htmlFor="company">Company</Label>
        <Input
          autoComplete="off"
          id="company"
          tabIndex={-1}
          {...register("company")}
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" autoComplete="name" {...register("name")} />
          <FieldError>{errors.name?.message}</FieldError>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            autoComplete="email"
            type="email"
            {...register("email")}
          />
          <FieldError>{errors.email?.message}</FieldError>
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" {...register("subject")} />
        <FieldError>{errors.subject?.message}</FieldError>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" rows={7} {...register("message")} />
        <FieldError>{errors.message?.message}</FieldError>
      </div>
      <Button disabled={isSubmitting} type="submit" variant="accent">
        <Send className="size-4" />
        {isSubmitting ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}

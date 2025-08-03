"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "@/lib/axios.config";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const formSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, {
      message: "Phone number must be at least 10 characters.",
    })
    .max(12, {
      message: "Phone number must be at most 15 characters.",
    })
    .regex(/^\d+$/, {
      message: "Phone number must contain only digits.",
    }),
});

export default function Login() {
  //navigate
  const navigate = useNavigate();

  //check localStorage for bookingId and bookingExpiry
  const bookingId = localStorage.getItem("bookingId");
  const phoneNumber = localStorage.getItem("phoneNumber");

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: phoneNumber || "",
    },
  });

  useEffect(() => {
    if (bookingId && phoneNumber) {
      navigate("/room");
    } else {
      // If the booking has expired, clear the localStorage
      localStorage.removeItem("bookingId");
      localStorage.removeItem("phoneNumber");
      localStorage.removeItem("roomNumber");
    }
  }, []);

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    console.log("Form submitted:", values);
    if (!values.phoneNumber) {
      console.error("Phone number and room number are required.");
      return;
    }

    axios
      .post("/chatbot/login", {
        phoneNumber: values.phoneNumber,
      })
      .then((response) => {
        console.log("Login successful:", response.data.data);
        // Handle successful login, e.g., redirect to chat page
        localStorage.setItem("bookingId", response.data.data.id);
        localStorage.setItem("phoneNumber", values.phoneNumber);

        // Redirect to chat page with bookingId
        navigate("/room");
      })
      .catch((error) => {
        console.error("Login failed:", error);
        // Handle login error, e.g., show an error message
        if (error.response) {
          console.error("Error response:", error.response.data);
        }
      });
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="1234567890" {...field} />
                </FormControl>
                {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <p>{}</p>

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}

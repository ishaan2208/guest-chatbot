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
import Processing from "@/components/Processing";
import { useState } from "react";

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
  const [submitDisabled, setSubmitDisabled] = useState(false);

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
      localStorage.removeItem("roomNumberId");
    }
  }, [bookingId, navigate, phoneNumber]);

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    setSubmitDisabled(true);
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
        form.setError("phoneNumber", {
          type: "manual",
          message: "Login failed. Please check your phone number.",
        });
        // Handle login error, e.g., show an error message
        if (error.response) {
          console.error("Error response:", error.response.data);
        }
      })
      .finally(() => {
        setSubmitDisabled(false);
      });
  }

  return (
    <div className="flex items-start  h-screen bg-black">
      <div className="max-w-md  p-6 flex flex-col items-center justify-start rounded-lg shadow-md w-full">
        <img className="h-52 w-52" src="/Zenvana logo.svg" alt="Zenvana Logo" />
        <h1 className="text-xl font-bold mb-6 text-center">Login</h1>
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={submitDisabled}
              variant={"secondary"}
              className="w-full"
              type="submit"
            >
              {submitDisabled ? <Processing /> : "Login"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

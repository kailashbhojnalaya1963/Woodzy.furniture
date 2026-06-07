import { z } from "zod";

export const orderItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  qty: z.number().int().positive(),
  price: z.number().nonnegative(),
});

export const checkoutSchema = z.object({
  customerName: z.string().min(2, "Please enter your name"),
  customerPhone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  customerEmail: z.string().email("Enter a valid email").optional().or(z.literal("")),
  addressLine: z.string().min(4, "Enter your address"),
  locality: z.string().min(2, "Enter your locality / area"),
  city: z.string().min(2, "Enter your city"),
  state: z.string().min(2, "Select your state"),
  pincode: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit PIN code"),
  items: z.array(orderItemSchema).min(1, "Your cart is empty"),
  subtotal: z.number().nonnegative(),
  notes: z.string().optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

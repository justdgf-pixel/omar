"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import {
  clearSessionCookie,
  hashPassword,
  setSessionCookie,
  signSession,
  verifyPassword,
} from "@/lib/auth";

const signupSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().toLowerCase(),
  password: z.string().min(6).max(200),
  wilaya: z.string().max(60).optional(),
  phone: z.string().max(40).optional(),
});

export async function signupAction(formData: FormData) {
  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    wilaya: formData.get("wilaya") || undefined,
    phone: formData.get("phone") || undefined,
  });
  if (!parsed.success) {
    redirect(`/signup?error=${encodeURIComponent("Vérifiez vos informations")}`);
  }
  const data = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    redirect(
      `/signup?error=${encodeURIComponent("Un compte existe déjà avec cet email")}`,
    );
  }
  const user = await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      passwordHash: await hashPassword(data.password),
      wilaya: data.wilaya,
      phone: data.phone,
      role: "BUYER",
    },
  });
  const token = await signSession({
    uid: user.id,
    role: user.role as "BUYER" | "SELLER" | "ADMIN",
    email: user.email,
    name: user.name,
  });
  await setSessionCookie(token);
  revalidatePath("/", "layout");
  redirect("/account");
}

const signinSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(1),
});

export async function signinAction(formData: FormData) {
  const parsed = signinSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    redirect(`/signin?error=${encodeURIComponent("Email ou mot de passe invalide")}`);
  }
  const u = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!u || !(await verifyPassword(parsed.data.password, u.passwordHash))) {
    redirect(`/signin?error=${encodeURIComponent("Email ou mot de passe invalide")}`);
  }
  const token = await signSession({
    uid: u!.id,
    role: u!.role as "BUYER" | "SELLER" | "ADMIN",
    email: u!.email,
    name: u!.name,
  });
  await setSessionCookie(token);
  revalidatePath("/", "layout");
  redirect("/account");
}

export async function signoutAction() {
  await clearSessionCookie();
  revalidatePath("/", "layout");
  redirect("/");
}

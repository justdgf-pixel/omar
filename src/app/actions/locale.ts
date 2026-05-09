"use server";

import { revalidatePath } from "next/cache";
import { LOCALES, type Locale } from "@/lib/i18n";
import { setLocale } from "@/lib/locale";

export async function setLocaleAction(formData: FormData) {
  const v = String(formData.get("locale") || "");
  if (!(LOCALES as readonly string[]).includes(v)) return;
  await setLocale(v as Locale);
  revalidatePath("/", "layout");
}

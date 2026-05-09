import React, { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <p className="text-gray-500">جار التحميل...</p>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}

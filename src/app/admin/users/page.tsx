import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function AdminUsersPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/");
  const users = await prisma.user.findMany({
    include: { sellerProfile: true, _count: { select: { orders: true } } },
    orderBy: { createdAt: "desc" },
  });
  return (
    <div className="container-page py-8">
      <h1 className="text-2xl font-bold">Utilisateurs</h1>
      <ul className="mt-4 grid gap-2 text-sm">
        {users.map((u) => (
          <li key={u.id} className="card flex flex-wrap items-center gap-3 p-3">
            <span className="flex-1">
              <p className="font-semibold">{u.name}</p>
              <p className="text-xs text-ink-500">{u.email}</p>
            </span>
            <span className="badge">{u.role}</span>
            {u.sellerProfile && (
              <span className="badge-brand">
                Boutique: /s/{u.sellerProfile.storeSlug}
              </span>
            )}
            <span className="text-xs text-ink-500">
              {u._count.orders} commandes
            </span>
            {u.wilaya && <span className="badge">{u.wilaya}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

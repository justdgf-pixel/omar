import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { getLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { formatDzd } from "@/lib/money";
import { getPaymentInstructions, methodLabel, type PaymentMethod } from "@/lib/payments";
import { submitProofAction } from "@/app/actions/checkout";

export default async function PayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/signin");
  const locale = await getLocale();
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order || order.buyerId !== user.id) notFound();
  const inst = getPaymentInstructions();

  return (
    <div className="container-page py-8">
      <div className="card mx-auto max-w-2xl p-6 sm:p-8">
        <h1 className="text-xl font-bold">Finaliser {order.number}</h1>
        <p className="text-sm text-ink-500">
          {t(locale, "checkout.method")}:{" "}
          <strong>{methodLabel(order.method as PaymentMethod, locale)}</strong>
        </p>

        <div className="mt-4 rounded-xl bg-ink-50 p-4 text-sm">
          <p>
            Montant à payer :{" "}
            <strong className="text-brand-700">
              {formatDzd(order.totalDzd, locale)}
            </strong>
          </p>
          {order.method === "CCP_TRANSFER" && (
            <p className="mt-2">
              CCP : <strong>{inst.ccpAccount}</strong> — {inst.ccpHolder}
            </p>
          )}
          {order.method === "BARIDIMOB" && (
            <p className="mt-2">
              RIP BaridiMob : <strong>{inst.baridimobRip}</strong>
            </p>
          )}
          {order.method === "RIB_BANK_TRANSFER" && (
            <p className="mt-2">
              {inst.ribBank} — RIB : <strong>{inst.ribAccount}</strong>
            </p>
          )}
          <p className="mt-2 text-xs text-ink-500">
            Indiquez la référence <strong>{order.number}</strong> dans le motif du
            virement.
          </p>
        </div>

        <form
          action={submitProofAction}
          encType="multipart/form-data"
          className="mt-6 space-y-4"
        >
          <input type="hidden" name="orderId" value={order.id} />
          <div>
            <label className="label" htmlFor="proof">
              {t(locale, "checkout.proof")}
            </label>
            <input
              id="proof"
              name="proof"
              type="file"
              accept="image/*,application/pdf"
              required={!order.proofImage}
              className="input"
            />
            {order.proofImage && (
              <p className="mt-1 text-xs text-ink-500">
                Justificatif déjà envoyé. Vous pouvez en envoyer un nouveau si besoin.
              </p>
            )}
          </div>
          <div>
            <label className="label" htmlFor="ref">
              {t(locale, "checkout.ref")}
            </label>
            <input id="ref" name="ref" defaultValue={order.proofRef ?? ""} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="note">
              {t(locale, "checkout.note")}
            </label>
            <textarea
              id="note"
              name="note"
              rows={2}
              defaultValue={order.buyerNote ?? ""}
              className="input"
            />
          </div>
          <button className="btn-primary">{t(locale, "checkout.confirm")}</button>
        </form>
      </div>
    </div>
  );
}

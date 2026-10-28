import { Check, MessageCircle, Send, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

import { brand } from "@/data/site";
import {
  clearQuoteBag,
  getQuoteBag,
  removeFromQuoteBag,
  submitCustomerInquiry,
  type BagItem,
} from "@/lib/cms-store";

interface QuoteBagDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuoteBagDrawer({ isOpen, onClose }: QuoteBagDrawerProps) {
  const [items, setItems] = useState<BagItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerWhatsapp, setCustomerWhatsapp] = useState("");
  const [sameAsPhone, setSameAsPhone] = useState(true);
  const [subcityArea, setSubcityArea] = useState("Bole");
  const [customerNotes, setCustomerNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittedInquiryNum, setSubmittedInquiryNum] = useState<string | null>(null);

  const refreshBag = () => {
    setItems(getQuoteBag());
  };

  useEffect(() => {
    refreshBag();
    const handleUpdate = () => refreshBag();
    window.addEventListener("ante-bag-updated", handleUpdate);
    return () => window.removeEventListener("ante-bag-updated", handleUpdate);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRemove = (id: string) => {
    const updated = removeFromQuoteBag(id);
    setItems(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;

    setSubmitting(true);
    try {
      const result = await submitCustomerInquiry({
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_whatsapp: sameAsPhone ? customerPhone : customerWhatsapp,
        subcity_area: subcityArea,
        customer_notes: customerNotes,
        items: items.map((i) => ({
          product_name: i.productName,
          selected_wood: i.selectedWood,
          selected_fabric: i.selectedFabric,
          quantity: i.quantity,
        })),
      });

      if (result.success) {
        setSubmittedInquiryNum(result.inquiry_number);
        clearQuoteBag();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const getWhatsAppMessage = () => {
    const itemsText = items
      .map(
        (i, idx) =>
          `${idx + 1}. *${i.productName}* (${i.selectedFabric}, ${i.selectedWood}) x${i.quantity}`,
      )
      .join("\n");

    const text = `Hello Anteniguss Home,\n\nI am interested in ordering custom furniture:\n${itemsText}\n\n*Name:* ${customerName || "Customer"}\n*Phone:* ${customerPhone || "N/A"}\n*Area:* ${subcityArea}\n*Notes:* ${customerNotes || "None"}\n\nPlease let me know pricing and next steps. Thank you!`;

    return encodeURIComponent(text);
  };

  const handleWhatsAppDirect = () => {
    const phone = brand.phone.replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${phone}?text=${getWhatsAppMessage()}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-lg bg-background text-foreground shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-6 py-5">
            <div>
              <p className="eyebrow text-muted-foreground">Anteniguss Concierge</p>
              <h2 className="display text-2xl">Bespoke Quote Bag</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Close quote bag"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {submittedInquiryNum ? (
              <div className="my-8 rounded-lg border border-border bg-stone p-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background">
                  <Check className="h-7 w-7" />
                </div>
                <h3 className="display mt-6 text-3xl">Inquiry Received</h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  Reference:{" "}
                  <span className="font-mono font-bold text-foreground">{submittedInquiryNum}</span>
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Thank you, <span className="font-semibold text-foreground">{customerName}</span>.
                  Our showroom concierge at Abkem Tower will contact you shortly at{" "}
                  <span className="font-semibold text-foreground">{customerPhone}</span> to discuss
                  custom sizing, fabric swatches, and quote details.
                </p>

                <div className="mt-8 flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={handleWhatsAppDirect}
                    className="inline-flex items-center justify-center gap-2 border border-foreground bg-foreground px-6 py-3.5 text-sm font-semibold text-background transition-opacity hover:opacity-90"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Open in WhatsApp Concierge
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedInquiryNum(null);
                      onClose();
                    }}
                    className="inline-flex items-center justify-center border border-border bg-transparent px-6 py-3 text-sm font-medium transition-colors hover:bg-stone"
                  >
                    Continue Browsing
                  </button>
                </div>
              </div>
            ) : items.length === 0 ? (
              <div className="my-16 text-center">
                <p className="text-muted-foreground">Your quote bag is currently empty.</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Browse our collection and click "Express Interest" on any piece to start a custom
                  quote.
                </p>
                <button
                  onClick={onClose}
                  className="mt-8 inline-flex items-center justify-center border border-foreground bg-foreground px-6 py-3 text-sm font-semibold text-background"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              <div>
                {/* List of items */}
                <div className="space-y-4">
                  <p className="eyebrow text-muted-foreground">Selected Pieces ({items.length})</p>
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 rounded-md border border-border bg-stone/40 p-3.5"
                    >
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="h-16 w-16 rounded object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate text-foreground">
                          {item.productName}
                        </h4>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {item.selectedFabric} · {item.selectedWood}
                        </p>
                        {item.dimensions && (
                          <p className="text-[11px] text-muted-foreground truncate">
                            {item.dimensions}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="p-1.5 text-muted-foreground transition-colors hover:text-destructive"
                        title="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="my-8 border-t border-border" />

                {/* Customer Details Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <p className="eyebrow text-muted-foreground">Your Details for Consultation</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      No payment required. We will call you to finalize fabrics, measurements, and
                      pricing.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lydia Mekonnen"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full rounded border border-input bg-background px-3.5 py-2.5 text-sm focus:border-foreground focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+251 9..."
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full rounded border border-input bg-background px-3.5 py-2.5 text-sm focus:border-foreground focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="samePhone"
                      checked={sameAsPhone}
                      onChange={(e) => setSameAsPhone(e.target.checked)}
                      className="rounded border-input text-foreground focus:ring-0"
                    />
                    <label htmlFor="samePhone" className="text-xs text-muted-foreground">
                      Same number is on WhatsApp
                    </label>
                  </div>

                  {!sameAsPhone && (
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
                        WhatsApp Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+251 9..."
                        value={customerWhatsapp}
                        onChange={(e) => setCustomerWhatsapp(e.target.value)}
                        className="w-full rounded border border-input bg-background px-3.5 py-2.5 text-sm focus:border-foreground focus:outline-none"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
                      Addis Ababa Area / Sub-City
                    </label>
                    <select
                      value={subcityArea}
                      onChange={(e) => setSubcityArea(e.target.value)}
                      className="w-full rounded border border-input bg-background px-3.5 py-2.5 text-sm focus:border-foreground focus:outline-none"
                    >
                      <option value="Bole">Bole (Rwanda, Atlas, Medhanialem)</option>
                      <option value="Kirkos">Kirkos (Meskel Flower, Kazanchis)</option>
                      <option value="Yeka">Yeka (CMC, Ayat, Megenagna)</option>
                      <option value="Nifas Silk">
                        Nifas Silk / Lafto (Bisrate Gabriel, Sarbet)
                      </option>
                      <option value="Lideta">Lideta</option>
                      <option value="Arada / Piassa">Arada / Piassa</option>
                      <option value="Showroom Pickup">Will visit Showroom at Abkem Tower</option>
                      <option value="Outside Addis Ababa">Outside Addis Ababa / Regional</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
                      Custom Dimensions or Notes (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Need the chaise on the left side, or want to view fabric samples first."
                      value={customerNotes}
                      onChange={(e) => setCustomerNotes(e.target.value)}
                      className="w-full rounded border border-input bg-background px-3.5 py-2 text-sm focus:border-foreground focus:outline-none"
                    />
                  </div>

                  <div className="pt-3 flex flex-col gap-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex w-full items-center justify-center gap-2 border border-foreground bg-foreground px-6 py-3.5 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                      <Send className="h-4 w-4" />
                      {submitting ? "Submitting Inquiry..." : "Submit Quote Request"}
                    </button>

                    <button
                      type="button"
                      onClick={handleWhatsAppDirect}
                      className="inline-flex w-full items-center justify-center gap-2 border border-border bg-transparent px-6 py-3 text-sm font-medium transition-colors hover:bg-stone"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Inquire Directly on WhatsApp
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

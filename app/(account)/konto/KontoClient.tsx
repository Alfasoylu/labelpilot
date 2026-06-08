"use client";

import { useEffect, useRef, useState } from "react";

import { ProofApprovalForm } from "@/components/account/ProofApprovalForm";
import {
  AccountSidebar,
  EmptyState,
  Icons,
  SkeletonCard,
  StatCard,
  StatusBadge,
} from "@/components/account/ui";
import type { AccountView } from "@/components/account/ui";
import { ReorderStartForm } from "@/components/reorder-start-form";
import { getSupabaseBrowserClient } from "@/lib/auth/supabase-browser";
import {
  getArtworkStatusLabel,
  getMaterialLabel,
} from "@/lib/orders/artwork";
import { describeArtworkStatus, describeOrderStatus, type StatusTone } from "@/lib/orders/status-style";

type AccountOrder = {
  id: string;
  orderNumber: string;
  status: string;
  artworkStatus: "AWAITING_ARTWORK" | "ARTWORK_UPLOADED" | "ARTWORK_APPROVED";
  productSlug: string;
  material: string;
  quantity: number;
  amountCents: number;
  currency: string;
  amountLabel: string;
  createdAt: string;
  uploadHref: string | null;
  trackingUrl: string | null;
  latestProof: {
    id: string;
    fileName: string;
    status: string;
    adminNote: string | null;
  } | null;
};

type AccountArtworkVersion = {
  id: string;
  versionLabel: string;
  approvedAt: string | null;
  status: string;
  originalArtworkFile: { fileName: string } | null;
  proofFile: { fileName: string } | null;
};

type AccountStoredDesign = {
  id: string;
  name: string;
  productSlug: string;
  labelSize: string | null;
  material: string | null;
  defaultQuantity: number | null;
  status: string;
  currentArtworkVersionId: string | null;
  lastOrderedAt: string | null;
  totalOrders: number;
  lastOrder: {
    id: string;
    orderNumber: string;
    createdAt: string;
  } | null;
  currentArtworkVersion: AccountArtworkVersion | null;
  artworkVersions: AccountArtworkVersion[];
};

type NotificationPrefs = {
  proofReady: boolean;
  shipped: boolean;
  reorderReminder: boolean;
  quoteUpdates: boolean;
};

type AccountCustomer = {
  email: string;
  companyName: string | null;
  contactName: string | null;
  phone: string | null;
  street: string | null;
  addressLine2: string | null;
  postalCode: string | null;
  city: string | null;
  country: string | null;
  vatId: string | null;
  billingCompanyName: string | null;
  billingStreet: string | null;
  billingAddressLine2: string | null;
  billingPostalCode: string | null;
  billingCity: string | null;
  billingCountry: string | null;
  notificationPrefs: NotificationPrefs | null;
  paymentTermsApproved: boolean;
  paymentTermsNetDays: number | null;
};

type AccountDashboard = {
  customer: AccountCustomer;
  orders: AccountOrder[];
  storedDesigns: AccountStoredDesign[];
};

const DEFAULT_NOTIFICATION_PREFS: NotificationPrefs = {
  proofReady: true,
  shipped: true,
  reorderReminder: true,
  quoteUpdates: true,
};

const NOTIFICATION_LABELS: { key: keyof NotificationPrefs; label: string; hint: string }[] = [
  { key: "proofReady", label: "Korrekturabzug bereit", hint: "E-Mail, sobald ein Proof zur Freigabe bereitsteht." },
  { key: "shipped", label: "Versandbenachrichtigung", hint: "E-Mail, sobald Ihre Bestellung versandt wurde." },
  { key: "reorderReminder", label: "Nachbestell-Erinnerung", hint: "Erinnerung, bevor Ihr Etikettenbestand zur Neige geht." },
  { key: "quoteUpdates", label: "Angebots-Updates", hint: "E-Mail bei Statusänderungen Ihrer Angebotsanfragen." },
];

type SupportAttachmentMeta = { name: string; size: number };

type SupportRequestItem = {
  id: string;
  type: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
  orderNumber: string | null;
  attachments?: SupportAttachmentMeta[];
};

function formatBytes(bytes: number): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

type RefillPredictionItem = {
  id: string;
  sourceDesignId: string | null;
  predictedDepletionAt: string;
  reminderWindowDays: number;
  isEnabled: boolean;
  orderNumber: string;
};

// Whole days from now until the given ISO date (negative = already past).
function daysUntil(iso: string): number {
  const target = new Date(iso).getTime();
  const now = Date.now();
  return Math.ceil((target - now) / 86_400_000);
}

const SUPPORT_TYPE_OPTIONS = [
  { value: "GENERAL", label: "Allgemeine Anfrage" },
  { value: "REPRINT", label: "Nachdruck / Reklamation" },
  { value: "BILLING", label: "Rechnung & Zahlung" },
  { value: "DELIVERY", label: "Lieferung & Versand" },
];

const SUPPORT_TYPE_LABELS: Record<string, string> = Object.fromEntries(
  SUPPORT_TYPE_OPTIONS.map((o) => [o.value, o.label]),
);

function describeSupportStatus(status: string): { tone: StatusTone; label: string } {
  switch (status) {
    case "RESOLVED":
      return { tone: "success", label: "Gelöst" };
    case "IN_REVIEW":
      return { tone: "info", label: "In Bearbeitung" };
    case "OPEN":
    default:
      return { tone: "warning", label: "Offen" };
  }
}

function formatDate(value: string | null) {
  if (!value) {
    return "Nicht vorhanden";
  }

  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
  }).format(new Date(value));
}

type OrderFilterKey = "all" | "open" | "approval" | "shipped" | "done";

const ORDER_FILTERS: { key: OrderFilterKey; label: string }[] = [
  { key: "all", label: "Alle" },
  { key: "open", label: "Offen" },
  { key: "approval", label: "Wartet auf Freigabe" },
  { key: "shipped", label: "Versandt" },
  { key: "done", label: "Abgeschlossen" },
];

function matchesOrderFilter(order: AccountOrder, filter: OrderFilterKey): boolean {
  switch (filter) {
    case "open":
      return !["DELIVERED", "COMPLETED", "CANCELLED", "PAYMENT_FAILED"].includes(order.status);
    case "approval":
      return order.latestProof != null || order.status === "WAITING_CUSTOMER_APPROVAL";
    case "shipped":
      return ["READY_TO_SHIP", "SHIPPED"].includes(order.status);
    case "done":
      return ["DELIVERED", "COMPLETED"].includes(order.status);
    case "all":
    default:
      return true;
  }
}

export function KontoClient() {
  const supabase = getSupabaseBrowserClient();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [dashboard, setDashboard] = useState<AccountDashboard | null>(null);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<AccountView>("overview");
  const [orderFilter, setOrderFilter] = useState<"all" | "open" | "approval" | "shipped" | "done">("all");
  const [orderSearch, setOrderSearch] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [profileFields, setProfileFields] = useState({
    contactName: "",
    companyName: "",
    phone: "",
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");

  const [addressEdit, setAddressEdit] = useState(false);
  const [addressFields, setAddressFields] = useState({
    street: "",
    addressLine2: "",
    postalCode: "",
    city: "",
    country: "",
    vatId: "",
  });
  const [addressSaving, setAddressSaving] = useState(false);
  const [addressMsg, setAddressMsg] = useState("");

  const [billingEdit, setBillingEdit] = useState(false);
  const [billingFields, setBillingFields] = useState({
    billingCompanyName: "",
    billingStreet: "",
    billingAddressLine2: "",
    billingPostalCode: "",
    billingCity: "",
    billingCountry: "",
  });
  const [billingSaving, setBillingSaving] = useState(false);
  const [billingMsg, setBillingMsg] = useState("");

  const [notifSaving, setNotifSaving] = useState<keyof NotificationPrefs | null>(null);
  const [notifSavedKey, setNotifSavedKey] = useState<keyof NotificationPrefs | null>(null);
  const [notifMsg, setNotifMsg] = useState("");

  const [supportRequests, setSupportRequests] = useState<SupportRequestItem[] | null>(null);
  const [supportForm, setSupportForm] = useState({ type: "GENERAL", orderId: "", subject: "", message: "" });
  const [supportSending, setSupportSending] = useState(false);
  const [supportMsg, setSupportMsg] = useState("");
  const [supportError, setSupportError] = useState("");
  const [supportLoadError, setSupportLoadError] = useState(false);
  const [supportFileNames, setSupportFileNames] = useState<string[]>([]);
  const supportFileRef = useRef<HTMLInputElement>(null);

  const [refillPredictions, setRefillPredictions] = useState<RefillPredictionItem[] | null>(null);
  const [refillTogglingId, setRefillTogglingId] = useState<string | null>(null);

  const [forgotMode, setForgotMode] = useState(false);
  const [passwordRecovery, setPasswordRecovery] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [newPasswordMsg, setNewPasswordMsg] = useState("");

  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [changePasswordMsg, setChangePasswordMsg] = useState("");

  const VALID_VIEWS: AccountView[] = ["overview", "orders", "designs", "profile", "documents", "support"];

  useEffect(() => {
    setMounted(true);
    const fromHash = window.location.hash.replace("#", "") as AccountView;
    if (VALID_VIEWS.includes(fromHash)) {
      setView(fromHash);
    }
    const onHashChange = () => {
      const next = window.location.hash.replace("#", "") as AccountView;
      setView(VALID_VIEWS.includes(next) ? next : "overview");
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function selectView(next: AccountView) {
    setView(next);
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", `#${next}`);
    }
  }

  useEffect(() => {
    const client = supabase;

    if (!client) {
      setLoading(false);
      return;
    }

    const activeClient = client;
    let ignore = false;

    async function loadSession() {
      const { data } = await activeClient.auth.getSession();
      const token = data.session?.access_token ?? null;

      if (!ignore) {
        setAccessToken(token);
        setLoading(false);
      }
    }

    void loadSession();

    const { data } = activeClient.auth.onAuthStateChange((event, session) => {
      setAccessToken(session?.access_token ?? null);
      if (event === "PASSWORD_RECOVERY") {
        setPasswordRecovery(true);
      }
    });

    return () => {
      ignore = true;
      data.subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (!accessToken) {
      setDashboard(null);
      return;
    }

    let ignore = false;

    async function loadDashboard() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch("/api/account/dashboard", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const result = (await response.json()) as AccountDashboard | { error: string };

        if (!response.ok || "error" in result) {
          throw new Error("error" in result ? result.error : "Kundenkonto konnte nicht geladen werden.");
        }

        if (!ignore) {
          setDashboard(result);
        }
      } catch (loadError) {
        if (!ignore) {
          setError(loadError instanceof Error ? loadError.message : "Kundenkonto konnte nicht geladen werden.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      ignore = true;
    };
  }, [accessToken]);

  // Lazy-load support requests the first time the Support view is opened.
  useEffect(() => {
    if (!accessToken || view !== "support" || supportRequests !== null) return;

    let ignore = false;

    async function loadSupport() {
      setSupportLoadError(false);
      try {
        const res = await fetch("/api/account/support", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = (await res.json()) as { requests?: SupportRequestItem[] };
        if (ignore) return;
        if (res.ok) {
          setSupportRequests(data.requests ?? []);
        } else {
          setSupportRequests([]);
          setSupportLoadError(true);
        }
      } catch {
        if (!ignore) {
          setSupportRequests([]);
          setSupportLoadError(true);
        }
      }
    }

    void loadSupport();
    return () => {
      ignore = true;
    };
  }, [accessToken, view, supportRequests]);

  async function handleSupportSubmit() {
    if (!accessToken) return;
    setSupportSending(true);
    setSupportMsg("");
    setSupportError("");
    try {
      const fd = new FormData();
      fd.set("type", supportForm.type);
      if (supportForm.orderId) fd.set("orderId", supportForm.orderId);
      fd.set("subject", supportForm.subject);
      fd.set("message", supportForm.message);
      const files = supportFileRef.current?.files;
      if (files) {
        for (const file of Array.from(files)) fd.append("attachment", file);
      }
      // No Content-Type header — the browser sets the multipart boundary.
      const res = await fetch("/api/account/support", {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: fd,
      });
      const data = (await res.json()) as { request?: SupportRequestItem; error?: string };
      if (!res.ok || !data.request) {
        setSupportError(data.error ?? "Anfrage konnte nicht gesendet werden.");
        return;
      }
      setSupportRequests((prev) => [data.request!, ...(prev ?? [])]);
      setSupportForm({ type: "GENERAL", orderId: "", subject: "", message: "" });
      setSupportFileNames([]);
      if (supportFileRef.current) supportFileRef.current.value = "";
      setSupportMsg("Ihre Anfrage wurde gesendet. Wir melden uns per E-Mail.");
    } catch {
      setSupportError("Anfrage konnte nicht gesendet werden.");
    } finally {
      setSupportSending(false);
    }
  }

  async function handleProofOpen(orderId: string, proofId: string) {
    if (!accessToken) return;
    setError("");
    try {
      const res = await fetch(`/api/account/orders/${orderId}/proof-file/${proofId}`, {
        headers: { Accept: "application/json", Authorization: `Bearer ${accessToken}` },
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (res.ok && data.url) {
        window.open(data.url, "_blank", "noopener");
      } else {
        setError(data.error ?? "Korrekturabzug konnte nicht geöffnet werden.");
      }
    } catch {
      setError("Korrekturabzug konnte nicht geöffnet werden.");
    }
  }

  async function handleSupportDownload(requestId: string, index: number) {
    if (!accessToken) return;
    setSupportError("");
    try {
      const res = await fetch(`/api/account/support/${requestId}/attachment/${index}`, {
        headers: { Accept: "application/json", Authorization: `Bearer ${accessToken}` },
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (res.ok && data.url) {
        window.open(data.url, "_blank", "noopener");
      } else {
        setSupportError(data.error ?? "Anhang konnte nicht geöffnet werden.");
      }
    } catch {
      setSupportError("Anhang konnte nicht geöffnet werden.");
    }
  }

  // Load all refill predictions for the overview "Nachbestellung" section.
  useEffect(() => {
    if (!accessToken || view !== "overview" || refillPredictions !== null) return;

    let ignore = false;

    async function loadPredictions() {
      try {
        const res = await fetch("/api/account/refill-predictions", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = (await res.json()) as { predictions?: RefillPredictionItem[] };
        if (!ignore) setRefillPredictions(res.ok ? data.predictions ?? [] : []);
      } catch {
        if (!ignore) setRefillPredictions([]);
      }
    }

    void loadPredictions();
    return () => {
      ignore = true;
    };
  }, [accessToken, view, refillPredictions]);

  async function toggleRefillReminder(id: string, next: boolean) {
    if (!accessToken) return;
    setRefillTogglingId(id);
    // Optimistic
    setRefillPredictions((prev) =>
      prev ? prev.map((p) => (p.id === id ? { ...p, isEnabled: next } : p)) : prev,
    );
    try {
      const res = await fetch(`/api/account/refill-predictions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ isEnabled: next }),
      });
      if (!res.ok) {
        setRefillPredictions((prev) =>
          prev ? prev.map((p) => (p.id === id ? { ...p, isEnabled: !next } : p)) : prev,
        );
      }
    } catch {
      setRefillPredictions((prev) =>
        prev ? prev.map((p) => (p.id === id ? { ...p, isEnabled: !next } : p)) : prev,
      );
    } finally {
      setRefillTogglingId(null);
    }
  }

  async function handleLogin(formData: FormData) {
    if (!supabase) return;
    setPending(true);
    setError("");
    setMessage("");

    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setPending(false);

    if (loginError) {
      setError("Die Anmeldung ist fehlgeschlagen.");
      return;
    }

    setMessage("Sie sind angemeldet.");
  }

  async function handleRegister(formData: FormData) {
    if (!supabase) return;
    setPending(true);
    setError("");
    setMessage("");

    const email = String(formData.get("registerEmail") ?? "");
    const password = String(formData.get("registerPassword") ?? "");
    const companyName = String(formData.get("companyName") ?? "");
    const contactName = String(formData.get("contactName") ?? "");
    const { error: registerError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          companyName,
          contactName,
        },
      },
    });

    setPending(false);

    if (registerError) {
      setError("Das Konto konnte nicht erstellt werden.");
      return;
    }

    setMessage("Konto angelegt. Bitte bestätigen Sie Ihre E-Mail-Adresse, falls eine Bestätigungsmail zugestellt wurde.");
  }

  async function handleChangePassword(formData: FormData) {
    if (!supabase) return;
    const pwd = String(formData.get("changePwd") ?? "");
    const confirm = String(formData.get("changePwdConfirm") ?? "");

    if (pwd.length < 8) {
      setChangePasswordMsg("Das Passwort muss mindestens 8 Zeichen lang sein.");
      return;
    }
    if (pwd !== confirm) {
      setChangePasswordMsg("Die Passwörter stimmen nicht überein.");
      return;
    }

    setPending(true);
    setChangePasswordMsg("");
    const { error: updateError } = await supabase.auth.updateUser({ password: pwd });
    setPending(false);

    if (updateError) {
      setChangePasswordMsg("Passwort konnte nicht geändert werden.");
      return;
    }

    setChangePasswordMode(false);
    setChangePasswordMsg("Passwort erfolgreich geändert.");
  }

  async function handleForgotPassword(formData: FormData) {
    if (!supabase) return;
    setPending(true);
    setError("");
    setMessage("");

    const email = String(formData.get("forgotEmail") ?? "");
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: typeof window !== "undefined"
        ? `${window.location.origin}/konto`
        : undefined,
    });

    setPending(false);

    if (resetError) {
      setError("Der Reset-Link konnte nicht gesendet werden.");
      return;
    }

    setForgotMode(false);
    setMessage("Reset-Link wurde an Ihre E-Mail-Adresse gesendet. Bitte prüfen Sie Ihr Postfach.");
  }

  async function handlePasswordUpdate(formData: FormData) {
    if (!supabase) return;
    const pwd = String(formData.get("newPassword") ?? "");
    const confirm = String(formData.get("confirmPassword") ?? "");

    if (pwd.length < 8) {
      setNewPasswordMsg("Das Passwort muss mindestens 8 Zeichen lang sein.");
      return;
    }
    if (pwd !== confirm) {
      setNewPasswordMsg("Die Passwörter stimmen nicht überein.");
      return;
    }

    setPending(true);
    setNewPasswordMsg("");

    const { error: updateError } = await supabase.auth.updateUser({ password: pwd });

    setPending(false);

    if (updateError) {
      setNewPasswordMsg("Passwort konnte nicht gesetzt werden.");
      return;
    }

    setPasswordRecovery(false);
    setNewPassword("");
    setNewPasswordConfirm("");
    setMessage("Passwort erfolgreich aktualisiert.");
  }

  async function handleLogout() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setMessage("Sie sind abgemeldet.");
  }

  function handleEditStart() {
    if (!dashboard) return;
    setProfileFields({
      contactName: dashboard.customer.contactName ?? "",
      companyName: dashboard.customer.companyName ?? "",
      phone: dashboard.customer.phone ?? "",
    });
    setProfileMsg("");
    setEditMode(true);
  }

  async function handleProfileSave() {
    if (!accessToken) return;
    setProfileSaving(true);
    setProfileMsg("");
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(profileFields),
      });
      const data = (await res.json()) as {
        contactName?: string | null;
        companyName?: string | null;
        phone?: string | null;
        error?: string;
      };
      if (!res.ok) {
        setProfileMsg(data.error ?? "Speichern fehlgeschlagen.");
        return;
      }
      setDashboard((prev) =>
        prev
          ? {
              ...prev,
              customer: {
                ...prev.customer,
                contactName: data.contactName ?? null,
                companyName: data.companyName ?? null,
                phone: data.phone ?? null,
              },
            }
          : prev,
      );
      setEditMode(false);
      setProfileMsg("Profil gespeichert.");
    } catch {
      setProfileMsg("Speichern fehlgeschlagen.");
    } finally {
      setProfileSaving(false);
    }
  }

  function handleAddressEditStart() {
    if (!dashboard) return;
    const c = dashboard.customer;
    setAddressFields({
      street: c.street ?? "",
      addressLine2: c.addressLine2 ?? "",
      postalCode: c.postalCode ?? "",
      city: c.city ?? "",
      country: c.country ?? "",
      vatId: c.vatId ?? "",
    });
    setAddressMsg("");
    setAddressEdit(true);
  }

  async function handleAddressSave() {
    if (!accessToken) return;
    setAddressSaving(true);
    setAddressMsg("");
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify(addressFields),
      });
      const data = (await res.json()) as Partial<AccountCustomer> & { error?: string };
      if (!res.ok) {
        setAddressMsg(data.error ?? "Speichern fehlgeschlagen.");
        return;
      }
      setDashboard((prev) =>
        prev
          ? {
              ...prev,
              customer: {
                ...prev.customer,
                street: data.street ?? null,
                addressLine2: data.addressLine2 ?? null,
                postalCode: data.postalCode ?? null,
                city: data.city ?? null,
                country: data.country ?? null,
                vatId: data.vatId ?? null,
              },
            }
          : prev,
      );
      setAddressEdit(false);
      setAddressMsg("Adresse gespeichert.");
    } catch {
      setAddressMsg("Speichern fehlgeschlagen.");
    } finally {
      setAddressSaving(false);
    }
  }

  function handleBillingEditStart(copyFromDelivery = false) {
    if (!dashboard) return;
    const c = dashboard.customer;
    if (copyFromDelivery) {
      setBillingFields({
        billingCompanyName: c.companyName ?? "",
        billingStreet: c.street ?? "",
        billingAddressLine2: c.addressLine2 ?? "",
        billingPostalCode: c.postalCode ?? "",
        billingCity: c.city ?? "",
        billingCountry: c.country ?? "",
      });
    } else {
      setBillingFields({
        billingCompanyName: c.billingCompanyName ?? "",
        billingStreet: c.billingStreet ?? "",
        billingAddressLine2: c.billingAddressLine2 ?? "",
        billingPostalCode: c.billingPostalCode ?? "",
        billingCity: c.billingCity ?? "",
        billingCountry: c.billingCountry ?? "",
      });
    }
    setBillingMsg("");
    setBillingEdit(true);
  }

  async function handleBillingSave() {
    if (!accessToken) return;
    setBillingSaving(true);
    setBillingMsg("");
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify(billingFields),
      });
      const data = (await res.json()) as Partial<AccountCustomer> & { error?: string };
      if (!res.ok) {
        setBillingMsg(data.error ?? "Speichern fehlgeschlagen.");
        return;
      }
      setDashboard((prev) =>
        prev
          ? {
              ...prev,
              customer: {
                ...prev.customer,
                billingCompanyName: data.billingCompanyName ?? null,
                billingStreet: data.billingStreet ?? null,
                billingAddressLine2: data.billingAddressLine2 ?? null,
                billingPostalCode: data.billingPostalCode ?? null,
                billingCity: data.billingCity ?? null,
                billingCountry: data.billingCountry ?? null,
              },
            }
          : prev,
      );
      setBillingEdit(false);
      setBillingMsg("Rechnungsadresse gespeichert.");
    } catch {
      setBillingMsg("Speichern fehlgeschlagen.");
    } finally {
      setBillingSaving(false);
    }
  }

  async function toggleNotificationPref(key: keyof NotificationPrefs, next: boolean) {
    if (!accessToken || !dashboard) return;
    const current: NotificationPrefs = { ...DEFAULT_NOTIFICATION_PREFS, ...(dashboard.customer.notificationPrefs ?? {}) };
    const updatedPrefs: NotificationPrefs = { ...current, [key]: next };
    setNotifSaving(key);
    setNotifSavedKey(null);
    setNotifMsg("");
    // Optimistic update
    setDashboard((prev) =>
      prev ? { ...prev, customer: { ...prev.customer, notificationPrefs: updatedPrefs } } : prev,
    );
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ notificationPrefs: updatedPrefs }),
      });
      if (res.ok) {
        setNotifSavedKey(key);
      } else {
        // Revert on failure
        setDashboard((prev) =>
          prev ? { ...prev, customer: { ...prev.customer, notificationPrefs: current } } : prev,
        );
        setNotifMsg("Einstellung konnte nicht gespeichert werden.");
      }
    } catch {
      setDashboard((prev) =>
        prev ? { ...prev, customer: { ...prev.customer, notificationPrefs: current } } : prev,
      );
      setNotifMsg("Einstellung konnte nicht gespeichert werden.");
    } finally {
      setNotifSaving(null);
    }
  }

  async function handleDownload(designId: string, versionId: string, asset: "artwork" | "proof") {
    if (!accessToken) return;
    setError("");

    const response = await fetch(
      `/api/stored-designs/${designId}/versions/${versionId}${asset === "proof" ? "?asset=proof" : ""}`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    const result = (await response.json()) as { url?: string; error?: string };

    if (!response.ok || !result.url) {
      setError(result.error ?? "Datei konnte nicht bereitgestellt werden.");
      return;
    }

    window.location.href = result.url;
  }

  if (!mounted) {
    return (
      <AccountShell>
        <article className="legal-card">
          <span className="eyebrow">Kundenkonto</span>
          <h1>Kundenkonto wird geladen …</h1>
          <p>Einen Moment bitte – Ihr Konto wird vorbereitet.</p>
        </article>
      </AccountShell>
    );
  }

  if (!supabase) {
    return (
      <AccountShell>
        <article className="legal-card">
          <span className="eyebrow">Kundenkonto</span>
          <h1>Kundenkonto derzeit nicht verfügbar</h1>
          <p>
            Die Supabase-Konfiguration für die Anmeldung fehlt. Bestehende Aufträge bleiben
            über den sicheren Bestelllink zugänglich; für neue Anfragen nutzen Sie bitte das
            Angebotsformular.
          </p>
          <a href="/de/angebot-anfordern" className="cta-link">
            Angebot anfordern
          </a>
        </article>
      </AccountShell>
    );
  }

  if (passwordRecovery) {
    return (
      <AccountShell>
        <article className="legal-card">
          <span className="eyebrow">Kundenkonto</span>
          <h1>Neues Passwort setzen</h1>
          <p>Bitte wählen Sie ein neues Passwort für Ihr Konto.</p>
        </article>
        <form action={handlePasswordUpdate} className="surface-card quote-form">
          <label htmlFor="newPassword">Neues Passwort</label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <label htmlFor="confirmPassword">Passwort bestätigen</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={newPasswordConfirm}
            onChange={(e) => setNewPasswordConfirm(e.target.value)}
          />
          {newPasswordMsg ? <p className="form-status error">{newPasswordMsg}</p> : null}
          <button type="submit" className="cta-button" disabled={pending}>
            {pending ? "Bitte warten ..." : "Passwort aktualisieren"}
          </button>
        </form>
        <StatusMessage message={message} error={error} />
      </AccountShell>
    );
  }

  if (!accessToken) {
    return (
      <AccountShell>
        <article className="legal-card">
          <span className="eyebrow">Kundenkonto</span>
          <h1>Anmelden und Etiketten schneller nachbestellen</h1>
          <p>
            Im Kundenkonto sehen Sie Ihre Bestellungen, gespeicherte Druckdaten und starten
            Nachbestellungen aus freigegebenen Designs. Der bisherige sichere Bestelllink
            bleibt als Fallback bestehen.
          </p>
        </article>

        <div className="two-column">
          {forgotMode ? (
            <form action={handleForgotPassword} className="surface-card quote-form">
              <h2>Passwort vergessen</h2>
              <p className="field-hint">
                Wir senden Ihnen einen Link zum Zurücksetzen Ihres Passworts.
              </p>
              <label htmlFor="forgotEmail">E-Mail-Adresse</label>
              <input id="forgotEmail" name="forgotEmail" type="email" required autoComplete="email" />
              <button type="submit" className="cta-button" disabled={pending}>
                {pending ? "Bitte warten ..." : "Reset-Link senden"}
              </button>
              <button
                type="button"
                className="secondary-link"
                onClick={() => setForgotMode(false)}
              >
                Zurück zur Anmeldung
              </button>
            </form>
          ) : (
            <form action={handleLogin} className="surface-card quote-form">
              <h2>Anmelden</h2>
              <label htmlFor="email">E-Mail-Adresse</label>
              <input id="email" name="email" type="email" required autoComplete="email" />
              <label htmlFor="password">Passwort</label>
              <input id="password" name="password" type="password" required autoComplete="current-password" />
              <button type="submit" className="cta-button" disabled={pending}>
                {pending ? "Bitte warten ..." : "Anmelden"}
              </button>
              <button
                type="button"
                className="secondary-link"
                style={{ fontSize: "0.88rem" }}
                onClick={() => { setForgotMode(true); setError(""); setMessage(""); }}
              >
                Passwort vergessen?
              </button>
            </form>
          )}

          <form action={handleRegister} className="surface-card quote-form" style={{ alignSelf: "flex-start" }}>
            <h2>Konto erstellen</h2>
            <label htmlFor="companyName">Firmenname</label>
            <input id="companyName" name="companyName" autoComplete="organization" />
            <label htmlFor="contactName">Ansprechpartner</label>
            <input id="contactName" name="contactName" autoComplete="name" />
            <label htmlFor="registerEmail">E-Mail-Adresse</label>
            <input id="registerEmail" name="registerEmail" type="email" required autoComplete="email" />
            <label htmlFor="registerPassword">Passwort</label>
            <input id="registerPassword" name="registerPassword" type="password" required autoComplete="new-password" minLength={8} />
            <button type="submit" className="cta-button" disabled={pending}>
              {pending ? "Bitte warten..." : "Konto erstellen"}
            </button>
          </form>
        </div>

        <StatusMessage message={message} error={error} />
      </AccountShell>
    );
  }

  const ACTIVE_ORDER_DONE = ["DELIVERED", "COMPLETED", "CANCELLED", "PAYMENT_FAILED"];
  const orders = dashboard?.orders ?? [];
  const storedDesigns = dashboard?.storedDesigns ?? [];
  const openOrdersCount = orders.filter((o) => !ACTIVE_ORDER_DONE.includes(o.status)).length;
  const awaitingApprovalCount = orders.filter(
    (o) => o.latestProof != null || o.status === "WAITING_CUSTOMER_APPROVAL",
  ).length;
  const totalSpentCents = orders
    .filter((o) => !["CANCELLED", "PAYMENT_FAILED", "PENDING_PAYMENT"].includes(o.status))
    .reduce((sum, o) => sum + (o.amountCents ?? 0), 0);
  const totalSpentLabel = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(totalSpentCents / 100);

  const customerLabel =
    dashboard?.customer.companyName ?? dashboard?.customer.contactName ?? dashboard?.customer.email;

  const orderSearchQuery = orderSearch.trim().toLowerCase();
  const filteredOrders = orders.filter((o) => {
    if (!matchesOrderFilter(o, orderFilter)) return false;
    if (!orderSearchQuery) return true;
    const haystack = `${o.orderNumber} ${getMaterialLabel(o.material)}`.toLowerCase();
    return haystack.includes(orderSearchQuery);
  });

  type DocumentEntry = {
    key: string;
    designId: string;
    designName: string;
    versionId: string;
    versionLabel: string;
    kind: "artwork" | "proof";
    fileName: string;
    approvedAt: string | null;
  };
  const documentEntries: DocumentEntry[] = storedDesigns.flatMap((d) =>
    d.artworkVersions.flatMap((v) => {
      const rows: DocumentEntry[] = [];
      if (v.originalArtworkFile) {
        rows.push({
          key: `${v.id}-art`,
          designId: d.id,
          designName: d.name,
          versionId: v.id,
          versionLabel: v.versionLabel,
          kind: "artwork",
          fileName: v.originalArtworkFile.fileName,
          approvedAt: v.approvedAt,
        });
      }
      if (v.proofFile) {
        rows.push({
          key: `${v.id}-proof`,
          designId: d.id,
          designName: d.name,
          versionId: v.id,
          versionLabel: v.versionLabel,
          kind: "proof",
          fileName: v.proofFile.fileName,
          approvedAt: v.approvedAt,
        });
      }
      return rows;
    }),
  );

  function renderOrderCard(order: AccountOrder) {
    const orderDesc = describeOrderStatus(order.status);
    const artworkDesc = describeArtworkStatus(order.artworkStatus);
    return (
      <div key={order.id} className="section-card">
        <div className="account-card-head">
          <h3>{order.orderNumber}</h3>
          <StatusBadge tone={orderDesc.tone}>{orderDesc.label}</StatusBadge>
        </div>
        <p className="price-note">
          {order.quantity.toLocaleString("de-DE")} Stück – {getMaterialLabel(order.material)} – {order.amountLabel}
        </p>
        <ul className="simple-list">
          <li>
            Druckdaten:{" "}
            <StatusBadge tone={artworkDesc.tone} size="sm">
              {getArtworkStatusLabel(order.artworkStatus)}
            </StatusBadge>
          </li>
          <li>Bestelldatum: {formatDate(order.createdAt)}</li>
        </ul>
        {order.latestProof ? (
          <div className="proof-banner">
            <p>
              <strong>Korrekturabzug wartet auf Ihre Freigabe.</strong>
            </p>
            {order.latestProof.adminNote ? (
              <p className="field-hint">{order.latestProof.adminNote}</p>
            ) : null}
            <ProofApprovalForm
              orderId={order.id}
              proofFileId={order.latestProof.id}
              accessToken={accessToken!}
              onSuccess={() => {
                setDashboard((prev) =>
                  prev
                    ? {
                        ...prev,
                        orders: prev.orders.map((o) =>
                          o.id === order.id
                            ? { ...o, latestProof: null, status: "APPROVED_FOR_PRODUCTION" }
                            : o,
                        ),
                      }
                    : prev,
                );
              }}
            />
            <button
              type="button"
              className="secondary-link"
              onClick={() => handleProofOpen(order.id, order.latestProof!.id)}
            >
              Korrekturabzug öffnen →
            </button>
          </div>
        ) : null}
        <div className="cta-row">
          {order.uploadHref && !order.latestProof ? (
            <a href={order.uploadHref} className="cta-link">
              {order.artworkStatus === "AWAITING_ARTWORK"
                ? "Druckdaten hochladen"
                : "Auftrag & Druckdaten öffnen"}
            </a>
          ) : null}
          {order.trackingUrl && (order.status === "SHIPPED" || order.status === "DELIVERED") ? (
            <a
              href={order.trackingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-link"
            >
              Sendung verfolgen →
            </a>
          ) : null}
          <a href={`/konto/bestellungen/${order.id}`} className="secondary-link">
            Details &amp; Nachbestellen
          </a>
        </div>
      </div>
    );
  }

  function renderDesignCard(design: AccountStoredDesign) {
    return (
      <div key={design.id} className="section-card">
        <div className="account-card-head">
          <h3>{design.name}</h3>
          {design.status === "ACTIVE" ? (
            <a href={`/konto/designs/${design.id}`} className="secondary-link">
              Details ansehen →
            </a>
          ) : null}
        </div>
        <p className="price-note">
          {design.productSlug} - {design.material ? getMaterialLabel(design.material) : "Material offen"} - {design.labelSize ?? "Format offen"}
        </p>
        <ul className="simple-list">
          <li>Letzte Bestellung: {design.lastOrder?.orderNumber ?? "Nicht vorhanden"}</li>
          <li>Letzte Freigabe: {formatDate(design.currentArtworkVersion?.approvedAt ?? null)}</li>
          <li>Bisherige Nachbestellungen: {design.totalOrders.toLocaleString("de-DE")}</li>
        </ul>

        {design.currentArtworkVersion ? (
          <div className="cta-row">
            {design.currentArtworkVersion.originalArtworkFile ? (
              <button
                type="button"
                className="secondary-link"
                onClick={() => handleDownload(design.id, design.currentArtworkVersion!.id, "artwork")}
              >
                Druckdatei herunterladen
              </button>
            ) : null}
            {design.currentArtworkVersion.proofFile ? (
              <button
                type="button"
                className="secondary-link"
                onClick={() => handleDownload(design.id, design.currentArtworkVersion!.id, "proof")}
              >
                Proof herunterladen
              </button>
            ) : null}
          </div>
        ) : null}

        <ReorderStartForm
          designId={design.id}
          accessToken={accessToken}
          defaultQuantity={design.defaultQuantity}
          currentArtworkVersionId={design.currentArtworkVersionId}
        />
      </div>
    );
  }

  const profileArticle = dashboard ? (
    <>
    <article className="surface-card">
      <h2>Kontodaten</h2>
      {editMode ? (
              <div className="section-stack">
                <div className="form-grid">
                  <div className="field">
                    <label htmlFor="konto-firma">Firma</label>
                    <input
                      id="konto-firma"
                      value={profileFields.companyName}
                      onChange={(e) =>
                        setProfileFields((p) => ({ ...p, companyName: e.target.value }))
                      }
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="konto-kontakt">Ansprechpartner</label>
                    <input
                      id="konto-kontakt"
                      value={profileFields.contactName}
                      onChange={(e) =>
                        setProfileFields((p) => ({ ...p, contactName: e.target.value }))
                      }
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="konto-phone">Telefon</label>
                    <input
                      id="konto-phone"
                      type="tel"
                      value={profileFields.phone}
                      onChange={(e) =>
                        setProfileFields((p) => ({ ...p, phone: e.target.value }))
                      }
                    />
                  </div>
                </div>
                {profileMsg ? <p className="form-status error">{profileMsg}</p> : null}
                <div className="inline-actions">
                  <button
                    type="button"
                    className="cta-button"
                    disabled={profileSaving}
                    onClick={handleProfileSave}
                  >
                    {profileSaving ? "Wird gespeichert ..." : "Speichern"}
                  </button>
                  <button
                    type="button"
                    className="secondary-link"
                    disabled={profileSaving}
                    onClick={() => { setEditMode(false); setProfileMsg(""); }}
                  >
                    Abbrechen
                  </button>
                </div>
              </div>
            ) : (
              <>
                <ul className="simple-list">
                  <li>E-Mail: {dashboard.customer.email}</li>
                  <li>Firma: {dashboard.customer.companyName ?? "Nicht hinterlegt"}</li>
                  <li>Ansprechpartner: {dashboard.customer.contactName ?? "Nicht hinterlegt"}</li>
                  {dashboard.customer.phone ? <li>Telefon: {dashboard.customer.phone}</li> : null}
                </ul>
                {profileMsg ? <p className="form-status success">{profileMsg}</p> : null}
                <div className="cta-row">
                  <button type="button" className="secondary-link" onClick={handleEditStart}>
                    Profil bearbeiten
                  </button>
                </div>
              </>
            )}
            <p className="field-hint">
              Rechnungskauf / Net-14 ist nur nach manueller Freigabe über Angebot oder
              Account-Betreuung möglich. Im Self-Serve-Checkout wird kein automatischer
              Rechnungskauf angeboten.
            </p>
          </article>

          <article className="surface-card">
            <h2>Passwort</h2>
            {changePasswordMode ? (
              <form action={handleChangePassword} className="section-stack">
                <div className="form-grid">
                  <div>
                    <label htmlFor="changePwd">Neues Passwort</label>
                    <input
                      id="changePwd"
                      name="changePwd"
                      type="password"
                      required
                      minLength={8}
                      autoComplete="new-password"
                    />
                  </div>
                  <div>
                    <label htmlFor="changePwdConfirm">Neues Passwort bestätigen</label>
                    <input
                      id="changePwdConfirm"
                      name="changePwdConfirm"
                      type="password"
                      required
                      minLength={8}
                      autoComplete="new-password"
                    />
                  </div>
                </div>
                {changePasswordMsg ? (
                  <p className="form-status error">{changePasswordMsg}</p>
                ) : null}
                <div className="inline-actions">
                  <button type="submit" className="cta-button" disabled={pending}>
                    {pending ? "Bitte warten ..." : "Passwort ändern"}
                  </button>
                  <button
                    type="button"
                    className="secondary-link"
                    onClick={() => { setChangePasswordMode(false); setChangePasswordMsg(""); }}
                  >
                    Abbrechen
                  </button>
                </div>
              </form>
            ) : (
              <>
                {changePasswordMsg ? (
                  <p className="form-status success">{changePasswordMsg}</p>
                ) : null}
                <div className="cta-row">
                  <button
                    type="button"
                    className="secondary-link"
                    onClick={() => { setChangePasswordMode(true); setChangePasswordMsg(""); }}
                  >
                    Passwort ändern
                  </button>
                </div>
              </>
            )}
          </article>

          <article className="surface-card">
            <div className="account-card-head">
              <h2>Lieferadresse & USt-IdNr.</h2>
              <span className="account-section-icon"><Icons.IconProfile size={20} /></span>
            </div>
            {addressEdit ? (
              <div className="section-stack">
                <div className="form-grid">
                  <div className="field field-full">
                    <label htmlFor="addr-street">Straße und Hausnummer</label>
                    <input id="addr-street" value={addressFields.street}
                      onChange={(e) => setAddressFields((p) => ({ ...p, street: e.target.value }))} />
                  </div>
                  <div className="field field-full">
                    <label htmlFor="addr-line2">Adresszusatz (optional)</label>
                    <input id="addr-line2" value={addressFields.addressLine2}
                      onChange={(e) => setAddressFields((p) => ({ ...p, addressLine2: e.target.value }))} />
                  </div>
                  <div className="field">
                    <label htmlFor="addr-plz">PLZ</label>
                    <input id="addr-plz" value={addressFields.postalCode}
                      onChange={(e) => setAddressFields((p) => ({ ...p, postalCode: e.target.value }))} />
                  </div>
                  <div className="field">
                    <label htmlFor="addr-city">Stadt</label>
                    <input id="addr-city" value={addressFields.city}
                      onChange={(e) => setAddressFields((p) => ({ ...p, city: e.target.value }))} />
                  </div>
                  <div className="field">
                    <label htmlFor="addr-country">Land</label>
                    <input id="addr-country" placeholder="z. B. Deutschland" value={addressFields.country}
                      onChange={(e) => setAddressFields((p) => ({ ...p, country: e.target.value }))} />
                  </div>
                  <div className="field">
                    <label htmlFor="addr-vat">USt-IdNr.</label>
                    <input id="addr-vat" placeholder="DE123456789" value={addressFields.vatId}
                      onChange={(e) => setAddressFields((p) => ({ ...p, vatId: e.target.value }))} />
                  </div>
                </div>
                {addressMsg ? <p className="form-status error">{addressMsg}</p> : null}
                <div className="inline-actions">
                  <button type="button" className="cta-button" disabled={addressSaving} onClick={handleAddressSave}>
                    {addressSaving ? "Wird gespeichert …" : "Speichern"}
                  </button>
                  <button type="button" className="secondary-link" disabled={addressSaving}
                    onClick={() => { setAddressEdit(false); setAddressMsg(""); }}>
                    Abbrechen
                  </button>
                </div>
              </div>
            ) : (
              <>
                <ul className="simple-list">
                  <li>
                    Anschrift:{" "}
                    {dashboard.customer.street
                      ? `${dashboard.customer.street}${dashboard.customer.addressLine2 ? `, ${dashboard.customer.addressLine2}` : ""}, ${dashboard.customer.postalCode ?? ""} ${dashboard.customer.city ?? ""}${dashboard.customer.country ? `, ${dashboard.customer.country}` : ""}`
                      : "Nicht hinterlegt"}
                  </li>
                  <li>USt-IdNr.: {dashboard.customer.vatId ?? "Nicht hinterlegt"}</li>
                </ul>
                {addressMsg ? <p className="form-status success">{addressMsg}</p> : null}
                <div className="cta-row">
                  <button type="button" className="secondary-link" onClick={handleAddressEditStart}>
                    Adresse bearbeiten
                  </button>
                </div>
              </>
            )}
          </article>

          <article className="surface-card">
            <div className="account-card-head">
              <h2>Rechnungsadresse</h2>
              <span className="account-section-icon"><Icons.IconDocuments size={20} /></span>
            </div>
            {billingEdit ? (
              <div className="section-stack">
                <div className="form-grid">
                  <div className="field field-full">
                    <label htmlFor="bill-company">Firma / Rechnungsempfänger</label>
                    <input id="bill-company" value={billingFields.billingCompanyName}
                      onChange={(e) => setBillingFields((p) => ({ ...p, billingCompanyName: e.target.value }))} />
                  </div>
                  <div className="field field-full">
                    <label htmlFor="bill-street">Straße und Hausnummer</label>
                    <input id="bill-street" value={billingFields.billingStreet}
                      onChange={(e) => setBillingFields((p) => ({ ...p, billingStreet: e.target.value }))} />
                  </div>
                  <div className="field field-full">
                    <label htmlFor="bill-line2">Adresszusatz (optional)</label>
                    <input id="bill-line2" value={billingFields.billingAddressLine2}
                      onChange={(e) => setBillingFields((p) => ({ ...p, billingAddressLine2: e.target.value }))} />
                  </div>
                  <div className="field">
                    <label htmlFor="bill-plz">PLZ</label>
                    <input id="bill-plz" value={billingFields.billingPostalCode}
                      onChange={(e) => setBillingFields((p) => ({ ...p, billingPostalCode: e.target.value }))} />
                  </div>
                  <div className="field">
                    <label htmlFor="bill-city">Stadt</label>
                    <input id="bill-city" value={billingFields.billingCity}
                      onChange={(e) => setBillingFields((p) => ({ ...p, billingCity: e.target.value }))} />
                  </div>
                  <div className="field">
                    <label htmlFor="bill-country">Land</label>
                    <input id="bill-country" placeholder="z. B. Deutschland" value={billingFields.billingCountry}
                      onChange={(e) => setBillingFields((p) => ({ ...p, billingCountry: e.target.value }))} />
                  </div>
                </div>
                {billingMsg ? <p className="form-status error">{billingMsg}</p> : null}
                <div className="inline-actions">
                  <button type="button" className="cta-button" disabled={billingSaving} onClick={handleBillingSave}>
                    {billingSaving ? "Wird gespeichert …" : "Speichern"}
                  </button>
                  <button type="button" className="secondary-link" disabled={billingSaving}
                    onClick={() => handleBillingEditStart(true)}>
                    Aus Lieferadresse übernehmen
                  </button>
                  <button type="button" className="secondary-link" disabled={billingSaving}
                    onClick={() => { setBillingEdit(false); setBillingMsg(""); }}>
                    Abbrechen
                  </button>
                </div>
              </div>
            ) : (
              <>
                {dashboard.customer.billingStreet ? (
                  <ul className="simple-list">
                    {dashboard.customer.billingCompanyName ? (
                      <li>Rechnungsempfänger: {dashboard.customer.billingCompanyName}</li>
                    ) : null}
                    <li>
                      Anschrift: {dashboard.customer.billingStreet}
                      {dashboard.customer.billingAddressLine2 ? `, ${dashboard.customer.billingAddressLine2}` : ""},{" "}
                      {dashboard.customer.billingPostalCode ?? ""} {dashboard.customer.billingCity ?? ""}
                      {dashboard.customer.billingCountry ? `, ${dashboard.customer.billingCountry}` : ""}
                    </li>
                  </ul>
                ) : (
                  <p className="field-hint">
                    Keine separate Rechnungsadresse hinterlegt – es gilt die Lieferadresse.
                  </p>
                )}
                {billingMsg ? <p className="form-status success">{billingMsg}</p> : null}
                <div className="cta-row">
                  <button type="button" className="secondary-link" onClick={() => handleBillingEditStart(false)}>
                    {dashboard.customer.billingStreet ? "Rechnungsadresse bearbeiten" : "Rechnungsadresse hinzufügen"}
                  </button>
                </div>
              </>
            )}
          </article>

          <article className="surface-card">
            <div className="account-card-head">
              <h2>Zahlungskonditionen</h2>
              <span className="account-section-icon"><Icons.IconEuro size={20} /></span>
            </div>
            {dashboard.customer.paymentTermsApproved ? (
              <>
                <div className="cta-row" style={{ alignItems: "center" }}>
                  <StatusBadge tone="success">
                    <Icons.IconCheck size={14} /> Rechnungskauf freigegeben
                  </StatusBadge>
                </div>
                <p className="field-hint">
                  Zahlungsziel: Netto-{dashboard.customer.paymentTermsNetDays ?? 15} Tage nach Lieferung.
                </p>
              </>
            ) : (
              <>
                <ul className="simple-list">
                  <li>Aktuelle Zahlart: Vorkasse (Stripe Checkout)</li>
                </ul>
                <p className="field-hint">
                  Rechnungskauf (Netto-15) ist nur nach manueller Freigabe für geprüfte
                  Geschäftskunden möglich.
                </p>
                <div className="cta-row">
                  <a href="/de/auf-rechnung-beantragen" className="secondary-link">
                    Rechnungskauf beantragen →
                  </a>
                </div>
              </>
            )}
          </article>

          <article className="surface-card">
            <div className="account-card-head">
              <h2>E-Mail-Benachrichtigungen</h2>
              <span className="account-section-icon"><Icons.IconClock size={20} /></span>
            </div>
            <p className="field-hint">
              Wichtige Bestell- und Freigabe-E-Mails erhalten Sie immer. Hier steuern Sie optionale
              Benachrichtigungen.
            </p>
            <div className="account-toggle-list">
              {NOTIFICATION_LABELS.map((n) => {
                const prefs: NotificationPrefs = { ...DEFAULT_NOTIFICATION_PREFS, ...(dashboard.customer.notificationPrefs ?? {}) };
                return (
                  <label key={n.key} className="account-toggle-row">
                    <input
                      type="checkbox"
                      checked={prefs[n.key]}
                      disabled={notifSaving === n.key}
                      onChange={(e) => toggleNotificationPref(n.key, e.target.checked)}
                    />
                    <span className="account-toggle-meta">
                      <span className="account-toggle-label">{n.label}</span>
                      <span className="account-toggle-hint">{n.hint}</span>
                    </span>
                    {notifSaving === n.key ? (
                      <span className="account-toggle-status account-toggle-status--saving">Wird gespeichert …</span>
                    ) : notifSavedKey === n.key ? (
                      <span className="account-toggle-status account-toggle-status--saved" role="status">✓ Gespeichert</span>
                    ) : null}
                  </label>
                );
              })}
            </div>
            {notifMsg ? <p className="form-status error">{notifMsg}</p> : null}
          </article>
    </>
  ) : null;

  return (
    <div className="container">
      <StatusMessage message={message} error={error} />
      <div className="account-shell">
        <AccountSidebar
          active={view}
          onSelect={selectView}
          counts={{
            orders: orders.length,
            designs: storedDesigns.length,
            documents: documentEntries.length,
            support: supportRequests?.filter((r) => r.status !== "RESOLVED").length ?? 0,
          }}
          onLogout={handleLogout}
          customerLabel={customerLabel ?? undefined}
        />
        <div className="account-main section-stack">
          {loading && !dashboard ? (
            <div className="section-stack">
              <div className="account-stat-grid">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </div>
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : null}

          {dashboard && view === "overview" ? (
            <>
              {!dashboard.customer.street || !dashboard.customer.vatId ? (
                <div className="account-nudge" role="region" aria-label="Profilhinweis">
                  <span className="account-nudge__icon"><Icons.IconAlert size={20} /></span>
                  <div className="account-nudge__body">
                    <strong>Profil vervollständigen</strong>
                    <span className="field-hint">
                      Hinterlegen Sie Anschrift und USt-IdNr., um den Bestellprozess zu beschleunigen
                      und Rechnungskauf zu beantragen.
                    </span>
                    <button
                      type="button"
                      className="secondary-link"
                      style={{ alignSelf: "flex-start", marginTop: "4px" }}
                      onClick={() => selectView("profile")}
                    >
                      Jetzt vervollständigen →
                    </button>
                  </div>
                </div>
              ) : null}
              <div className="account-stat-grid">
                <StatCard
                  label="Offene Bestellungen"
                  value={openOrdersCount}
                  tone="neutral"
                  icon={<Icons.IconBox size={20} />}
                  onActivate={() => selectView("orders")}
                />
                <StatCard
                  label="Wartet auf Freigabe"
                  value={awaitingApprovalCount}
                  tone="proof"
                  icon={<Icons.IconProof size={20} />}
                  onActivate={() => selectView("orders")}
                />
                <StatCard
                  label="Gespeicherte Designs"
                  value={storedDesigns.length}
                  tone="accent"
                  icon={<Icons.IconDesigns size={20} />}
                  onActivate={() => selectView("designs")}
                />
                <StatCard
                  label="Gesamtausgaben"
                  value={totalSpentLabel}
                  tone="success"
                  icon={<Icons.IconEuro size={20} />}
                  hint="Ohne stornierte Bestellungen"
                />
              </div>

              {refillPredictions && refillPredictions.length > 0 ? (
                <article className="surface-card">
                  <div className="account-card-head">
                    <h2>Nachbestellung im Blick</h2>
                    <span className="account-section-icon"><Icons.IconRepeat size={20} /></span>
                  </div>
                  <p className="field-hint">
                    Geschätzter Verbrauch Ihrer letzten Bestellungen – aktivieren Sie eine
                    Erinnerung, bevor der Etikettenbestand zur Neige geht.
                  </p>
                  <div className="section-stack">
                    {[...refillPredictions]
                      .sort((a, b) => a.predictedDepletionAt.localeCompare(b.predictedDepletionAt))
                      .map((p) => {
                        const days = daysUntil(p.predictedDepletionAt);
                        const soon = days <= 45;
                        return (
                          <div key={p.id} className="account-reminder-row">
                            <span className="account-reminder-meta">
                              <span className="account-reminder-date">
                                {p.orderNumber} · aufgebraucht ca. {formatDate(p.predictedDepletionAt)}
                              </span>
                              <span className="account-reminder-sub">
                                {days > 0 ? `noch ca. ${days} Tage` : "Bestand vermutlich aufgebraucht"}
                                {soon ? " · bald fällig" : ""} · Erinnerung {p.reminderWindowDays} Tage vorher
                              </span>
                            </span>
                            <span className="account-reminder-actions">
                              {p.sourceDesignId ? (
                                <a href={`/konto/designs/${p.sourceDesignId}`} className="secondary-link">
                                  Nachbestellen →
                                </a>
                              ) : null}
                              {p.isEnabled ? (
                                <>
                                  <StatusBadge tone="success" size="sm">
                                    <Icons.IconCheck size={13} /> Erinnerung aktiv
                                  </StatusBadge>
                                  <button
                                    type="button"
                                    className="secondary-link"
                                    disabled={refillTogglingId === p.id}
                                    onClick={() => toggleRefillReminder(p.id, false)}
                                  >
                                    Aus
                                  </button>
                                </>
                              ) : (
                                <button
                                  type="button"
                                  className="cta-button account-reminder-cta"
                                  disabled={refillTogglingId === p.id}
                                  onClick={() => toggleRefillReminder(p.id, true)}
                                >
                                  {refillTogglingId === p.id ? "…" : "Erinnerung aktivieren"}
                                </button>
                              )}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </article>
              ) : null}

              <article className="surface-card">
                <div className="account-card-head">
                  <h2>Letzte Bestellungen</h2>
                  {orders.length > 3 ? (
                    <button
                      type="button"
                      className="secondary-link"
                      onClick={() => selectView("orders")}
                    >
                      Alle anzeigen
                    </button>
                  ) : null}
                </div>
                {orders.length === 0 ? (
                  <EmptyState
                    icon={<Icons.IconOrders size={32} />}
                    title="Noch keine Bestellungen"
                    description="Sobald eine Bestellung mit dieser E-Mail vorliegt, erscheint sie hier."
                    action={{ label: "Angebot anfordern", href: "/de/angebot-anfordern" }}
                  />
                ) : (
                  <div className="section-stack">{orders.slice(0, 3).map(renderOrderCard)}</div>
                )}
              </article>
            </>
          ) : null}

          {dashboard && view === "orders" ? (
            <article className="surface-card">
              <h2>Meine Bestellungen</h2>
              {orders.length === 0 ? (
                <EmptyState
                  icon={<Icons.IconOrders size={32} />}
                  title="Noch keine verknüpften Bestellungen"
                  description="Sobald eine Bestellung mit dieser E-Mail vorliegt, erscheint sie hier."
                  action={{ label: "Angebot anfordern", href: "/de/angebot-anfordern" }}
                />
              ) : (
                <>
                  <div className="account-filterbar">
                    <div className="account-filter-chips" role="tablist" aria-label="Bestellungen filtern">
                      {ORDER_FILTERS.map((f) => {
                        const count = orders.filter((o) => matchesOrderFilter(o, f.key)).length;
                        return (
                          <button
                            key={f.key}
                            type="button"
                            role="tab"
                            aria-selected={orderFilter === f.key}
                            className={`account-chip${orderFilter === f.key ? " account-chip--active" : ""}`}
                            onClick={() => setOrderFilter(f.key)}
                          >
                            {f.label}
                            <span className="account-chip__badge">{count}</span>
                          </button>
                        );
                      })}
                    </div>
                    <input
                      type="search"
                      className="account-search"
                      placeholder="Bestellnummer oder Material suchen …"
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      aria-label="Bestellungen durchsuchen"
                    />
                  </div>
                  {filteredOrders.length === 0 ? (
                    <EmptyState
                      icon={<Icons.IconOrders size={32} />}
                      title="Keine Bestellungen gefunden"
                      description="Für diese Filter- und Suchkombination gibt es keine Treffer."
                    />
                  ) : (
                    <>
                      <p className="field-hint" role="status" aria-live="polite">
                        {filteredOrders.length}{" "}
                        {filteredOrders.length === 1 ? "Bestellung" : "Bestellungen"} angezeigt
                      </p>
                      <div className="section-stack">{filteredOrders.map(renderOrderCard)}</div>
                    </>
                  )}
                </>
              )}
            </article>
          ) : null}

          {dashboard && view === "designs" ? (
            <article className="surface-card">
              <h2>Gespeicherte Designs</h2>
              {storedDesigns.length === 0 ? (
                <EmptyState
                  icon={<Icons.IconDesigns size={32} />}
                  title="Noch keine gespeicherten Designs"
                  description="Nach Freigabe eines Auftrags wird die Spezifikation für spätere Nachbestellungen vorbereitet."
                />
              ) : (
                <div className="section-stack">{storedDesigns.map(renderDesignCard)}</div>
              )}
            </article>
          ) : null}

          {dashboard && view === "profile" ? profileArticle : null}

          {dashboard && view === "documents" ? (
            <article className="surface-card">
              <h2>Dokumente</h2>
              <p className="field-hint">
                Freigegebene Druckdaten und Korrekturabzüge aus Ihren gespeicherten Designs.
              </p>
              {documentEntries.length === 0 ? (
                <EmptyState
                  icon={<Icons.IconDocuments size={32} />}
                  title="Noch keine Dokumente verfügbar"
                  description="Druckdaten und Korrekturabzüge erscheinen hier, sobald ein Design freigegeben wurde."
                />
              ) : (
                <ul className="account-doc-list">
                  {documentEntries.map((doc) => (
                    <li key={doc.key} className="account-doc-row">
                      <span className="account-doc-icon">
                        {doc.kind === "proof" ? <Icons.IconProof size={18} /> : <Icons.IconDocuments size={18} />}
                      </span>
                      <span className="account-doc-meta">
                        <span className="account-doc-name">{doc.fileName}</span>
                        <span className="account-doc-sub">
                          {doc.designName} · {doc.versionLabel} ·{" "}
                          {doc.kind === "proof" ? "Korrekturabzug" : "Druckdatei"}
                        </span>
                      </span>
                      <button
                        type="button"
                        className="secondary-link account-doc-action"
                        onClick={() => handleDownload(doc.designId, doc.versionId, doc.kind)}
                      >
                        <Icons.IconDownload size={15} /> Herunterladen
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ) : null}

          {dashboard && view === "support" ? (
            <>
              <article className="surface-card">
                <div className="account-card-head">
                  <h2>Support-Anfrage</h2>
                  <span className="account-section-icon"><Icons.IconSupport size={20} /></span>
                </div>
                <p className="field-hint">
                  Fragen zu Bestellung, Nachdruck, Rechnung oder Lieferung? Schreiben Sie uns – wir
                  antworten per E-Mail.
                </p>
                <div className="section-stack">
                  <div className="form-grid">
                    <div className="field">
                      <label htmlFor="support-type">Anliegen</label>
                      <select
                        id="support-type"
                        value={supportForm.type}
                        onChange={(e) => setSupportForm((f) => ({ ...f, type: e.target.value }))}
                      >
                        {SUPPORT_TYPE_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="field">
                      <label htmlFor="support-order">Bestellung (optional)</label>
                      <select
                        id="support-order"
                        value={supportForm.orderId}
                        onChange={(e) => setSupportForm((f) => ({ ...f, orderId: e.target.value }))}
                      >
                        <option value="">Keine Zuordnung</option>
                        {orders.map((o) => (
                          <option key={o.id} value={o.id}>{o.orderNumber}</option>
                        ))}
                      </select>
                    </div>
                    <div className="field field-full">
                      <label htmlFor="support-subject">Betreff</label>
                      <input
                        id="support-subject"
                        value={supportForm.subject}
                        maxLength={160}
                        onChange={(e) => setSupportForm((f) => ({ ...f, subject: e.target.value }))}
                      />
                    </div>
                    <div className="field field-full">
                      <label htmlFor="support-message">Nachricht</label>
                      <textarea
                        id="support-message"
                        rows={5}
                        value={supportForm.message}
                        maxLength={2000}
                        onChange={(e) => setSupportForm((f) => ({ ...f, message: e.target.value }))}
                      />
                    </div>
                    <div className="field field-full">
                      <label htmlFor="support-files">Design / Datei anhängen (optional)</label>
                      <input
                        id="support-files"
                        ref={supportFileRef}
                        type="file"
                        multiple
                        accept=".pdf,.ai,.eps,.svg,.png,.jpg,.jpeg,.tif,.tiff,.zip"
                        onChange={(e) =>
                          setSupportFileNames(Array.from(e.target.files ?? []).map((f) => f.name))
                        }
                      />
                      <p className="field-hint">
                        PDF, AI, EPS, SVG, PNG, JPG, TIFF oder ZIP. Bis zu 3 Dateien.
                      </p>
                      {supportFileNames.length > 0 ? (
                        <ul className="account-attach-list">
                          {supportFileNames.map((name, i) => (
                            <li key={`${name}-${i}`} className="account-attach-chip">
                              <Icons.IconDocuments size={14} /> {name}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </div>
                  {supportError ? <p className="form-status error" role="alert">{supportError}</p> : null}
                  {supportMsg ? <p className="form-status success" role="status">{supportMsg}</p> : null}
                  <div className="inline-actions">
                    <button
                      type="button"
                      className="cta-button"
                      disabled={supportSending || supportForm.subject.trim().length < 3 || supportForm.message.trim().length < 5}
                      onClick={handleSupportSubmit}
                    >
                      {supportSending ? "Wird gesendet …" : "Anfrage senden"}
                    </button>
                  </div>
                </div>
              </article>

              <article className="surface-card">
                <h2>Meine Anfragen</h2>
                {supportRequests === null ? (
                  <SkeletonCard />
                ) : supportLoadError ? (
                  <EmptyState
                    icon={<Icons.IconAlert size={32} />}
                    title="Anfragen konnten nicht geladen werden"
                    description="Bitte versuchen Sie es erneut."
                    action={{
                      label: "Erneut versuchen",
                      onClick: () => {
                        setSupportLoadError(false);
                        setSupportRequests(null);
                      },
                    }}
                  />
                ) : supportRequests.length === 0 ? (
                  <EmptyState
                    icon={<Icons.IconSupport size={32} />}
                    title="Noch keine Anfragen"
                    description="Ihre Support-Anfragen erscheinen hier mit aktuellem Status."
                  />
                ) : (
                  <div className="section-stack">
                    {supportRequests.map((r) => {
                      const s = describeSupportStatus(r.status);
                      return (
                        <div key={r.id} className="section-card">
                          <div className="account-card-head">
                            <h3>{r.subject}</h3>
                            <StatusBadge tone={s.tone} size="sm">{s.label}</StatusBadge>
                          </div>
                          <p className="price-note">
                            {SUPPORT_TYPE_LABELS[r.type] ?? r.type}
                            {r.orderNumber ? ` · ${r.orderNumber}` : ""} · {formatDate(r.createdAt)}
                          </p>
                          <p className="account-support-message">{r.message}</p>
                          {r.attachments && r.attachments.length > 0 ? (
                            <ul className="account-attach-list">
                              {r.attachments.map((a, i) => (
                                <li key={`${r.id}-att-${i}`}>
                                  <button
                                    type="button"
                                    className="account-attach-chip account-attach-chip--link"
                                    onClick={() => handleSupportDownload(r.id, i)}
                                  >
                                    <Icons.IconDownload size={14} /> {a.name}
                                    {a.size ? <span className="account-attach-size">{formatBytes(a.size)}</span> : null}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                )}
              </article>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function AccountShell({ children }: { children: React.ReactNode }) {
  return <div className="container section-stack">{children}</div>;
}

function StatusMessage({ message, error }: { message: string; error: string }) {
  return (
    <>
      {message ? <p className="form-status success" role="status" aria-live="polite">{message}</p> : null}
      {error ? <p className="form-status error" role="alert">{error}</p> : null}
    </>
  );
}

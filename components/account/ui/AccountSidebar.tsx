import {
  IconDashboard,
  IconDocuments,
  IconDesigns,
  IconOrders,
  IconProfile,
} from "./Icons";

export type AccountView = "overview" | "orders" | "designs" | "profile" | "documents";

const NAV_ITEMS: { view: AccountView; label: string; Icon: typeof IconDashboard }[] = [
  { view: "overview", label: "Übersicht", Icon: IconDashboard },
  { view: "orders", label: "Bestellungen", Icon: IconOrders },
  { view: "designs", label: "Designs", Icon: IconDesigns },
  { view: "profile", label: "Profil", Icon: IconProfile },
  { view: "documents", label: "Dokumente", Icon: IconDocuments },
];

interface AccountSidebarProps {
  active: AccountView;
  onSelect: (view: AccountView) => void;
  counts?: Partial<Record<AccountView, number>>;
  onLogout: () => void;
  customerLabel?: string;
}

export function AccountSidebar({ active, onSelect, counts, onLogout, customerLabel }: AccountSidebarProps) {
  return (
    <aside className="account-sidebar">
      {customerLabel ? (
        <div className="account-sidebar__head">
          <span className="eyebrow">Mein Konto</span>
          <span className="account-sidebar__name">{customerLabel}</span>
        </div>
      ) : null}
      <nav className="account-nav" aria-label="Kontobereiche">
        {NAV_ITEMS.map(({ view, label, Icon }) => {
          const count = counts?.[view];
          return (
            <button
              key={view}
              type="button"
              className={`account-nav__item${active === view ? " account-nav__item--active" : ""}`}
              aria-current={active === view ? "page" : undefined}
              onClick={() => onSelect(view)}
            >
              <Icon size={18} className="account-nav__icon" />
              <span className="account-nav__label">{label}</span>
              {typeof count === "number" && count > 0 ? (
                <span className="account-nav__count">{count}</span>
              ) : null}
            </button>
          );
        })}
      </nav>
      <button type="button" className="secondary-link account-nav__logout" onClick={onLogout}>
        Abmelden
      </button>
    </aside>
  );
}

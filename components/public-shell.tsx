import { ConsentBanner } from "@/components/consent/ConsentBanner";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { LiveChat } from "@/components/chat/LiveChat";
import { VisitorTracker } from "@/components/analytics/VisitorTracker";
import { isCustomSizeEnabled } from "@/lib/pricing/custom-size-feature";
import { getFooterLinks, getSiteNavigation } from "@/lib/site-content";

export function PublicShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const customSizeEnabled = isCustomSizeEnabled();

  return (
    <div className="site-shell">
      <Header navigation={getSiteNavigation(customSizeEnabled)} />
      <main className="page-main">{children}</main>
      <Footer groups={getFooterLinks(customSizeEnabled)} />
      <LiveChat />
      <ConsentBanner />
      <VisitorTracker />
    </div>
  );
}

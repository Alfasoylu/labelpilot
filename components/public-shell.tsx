import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { footerLinks, siteNavigation } from "@/lib/site-content";

export function PublicShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="site-shell">
      <Header navigation={siteNavigation} />
      <main className="page-main">{children}</main>
      <Footer groups={footerLinks} />
    </div>
  );
}

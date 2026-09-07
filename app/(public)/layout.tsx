import { JsonLd } from "@/components/json-ld";
import { PublicShell } from "@/components/public-shell";
import { buildOrganizationSchema, buildWebSiteSchema } from "@/lib/seo";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* Organization and WebSite carry stable @id values that page-level schema
          (Article author/publisher, Service provider, Product manufacturer)
          references. Emitting them on every public page keeps those references
          resolvable instead of pointing at a node that only exists on /de. */}
      <JsonLd data={buildOrganizationSchema()} />
      <JsonLd data={buildWebSiteSchema()} />
      <PublicShell>{children}</PublicShell>
    </>
  );
}

# Day-7 Deep Scan — Prioritized Task List
**Date:** 2026-06-11 | **Method:** 36-agent full-repo scan (8 subsystems), high-impact findings adversarially verified against code.

---

## P0 — Para kaybettiren / siparişi kıran (bugün)

| # | Sorun | Kanıt | Efor |
|---|-------|-------|------|
| 1 | **Artwork upload >4.5MB Vercel'de çalışamaz.** Kod 150MB ilan ediyor ama Vercel serverless body limiti ~4.5MB — gerçek baskı PDF'i (5–100MB) ödeme SONRASI en kritik adımda 413 ile patlar. Çözüm: Supabase Storage signed upload URL ile tarayıcıdan direkt yükleme. | `app/api/orders/[orderId]/artwork/route.ts:27`; ölü Pages-Router config :19-24 | 1g |
| 2 | **Admin artwork/proof indirme 401 veriyor** (Supabase-session auth altında `getAdminActorFromRequest` Basic-Auth bekliyor). Founder müşterinin dosyasını indiremez = sipariş karşılanamaz. | `app/api/admin/orders/[orderId]/artwork/[fileId]/route.ts:16-19`, `proofs/[proofId]/route.ts:14-17` | 1s |
| 3 | **Yeni PAID sipariş görünmez:** webhook admin'e e-posta atmıyor, dashboard PAID'i saymıyor, liste filtresi gizliyor. Sipariş gelir, kimse fark etmez. | `app/api/stripe/webhook/route.ts:233-238`; `app/(admin)/admin/page.tsx:36-79` | 2-3s |
| 4 | **ADMIN_NOTIFY_EMAIL → Hotmail forwarding hiç doğrulanmadı** (SoT'de açık follow-up). Tüm sipariş/lead bildirimleri bu hatta. Canlı test şart. | `docs/00-SOURCE-OF-TRUTH.md:177` | 10dk + test |
| 5 | **Kalkulator Designservice (+40€) checkout'a geçmiyor:** fiyat kutusunda gösteriliyor ama Stripe'a designFee'siz net/brüt gidiyor — müşteri hizmeti bekler, para alınmaz, sipariş kaydında iz yok. | `KalkulatorClient.tsx:759-760` (totalNetPrice geçilmiyor) | 2s |
| 6 | **Wunschformat siparişinde Klebertyp / UV-Lack / Eckenradius kayboluyor:** müşteri seçiyor, özette görüyor, order.create'te alan yok → üretim yanlış spec ile yapılır. | `lib/checkout/intake.ts:109-122`; `create-custom-session/route.ts:132-178` | yarım gün |

## P1 — Ads açmadan önce (bu hafta, bilinen AW- tag'e ek)

| # | Sorun | Kanıt | Efor |
|---|-------|-------|------|
| 7 | **Consent Mode 'update' geri dönen ziyaretçide re-fire edilmiyor** → ikinci ziyarette satın alan herkesin GA4/Ads conversion'ı consent-denied kaybolur. B2B'de alıcılar nadiren ilk ziyarette alır. Fix: mount'ta stored consent varsa `gtagConsent('update', ...)` ateşle. | `ConsentBanner.tsx:22-41` vs :53-58 | 30dk |
| 8 | **Purchase event webhook yarışını kaybediyor:** Stripe redirect webhook'tan önce gelirse success page null döner, GA4 purchase HİÇ ateşlenmez (poll/refresh yok). | `checkout/success/page.tsx:64-67,106-111` | 2-3s |
| 9 | **Canlı funnel'da begin_checkout yok** — event sadece hiçbir sayfanın import etmediği CheckoutButton'da. Canlı yol (Kalkulator → CustomSizeCheckoutForm) hiçbir şey ateşlemiyor. | `CheckoutButton.tsx:189` (dead code) | 1s |
| 10 | **gtag Ads conversion çağrısı guard'sız** — `NEXT_PUBLIC_ADS_CONVERSION_ID` set edilir edilmez, gtag'ı bloklayan tarayıcıda success page throw eder. | `lib/analytics/gtag.ts:64-71` | 15dk |
| 11 | **Mobile LCP 4.5–5.3s (perf 69–74):** hero görseli iki kez indiriliyor, ikisi de `priority`. Ads ile mobil trafik alacaksın — bu dönüşümü doğrudan vurur. | `HeroKalkulator.tsx`; lighthouse-report*.json | 2-3s |
| 12 | **S17 sellability testi hiç koşulmadı** — dokümante pre-Ads go/no-go kapısı; sign-off tablosu boş. P0'lar bitince uçtan uca koş. | `docs/S17-SELLABILITY-TEST-CHECKLIST.md:121-125` | 2-3s manuel |

## P2 — Hukuki / güven (bu hafta)

| # | Sorun | Kanıt | Efor |
|---|-------|-------|------|
| 13 | **VAT çelişkisi:** site her yerde "inkl. 19% MwSt." gösteriyor/tahsil ediyor ama EU/DE VAT kaydı yok ve Impressum "Keine USt-IdNr." diyor — S19 dokümanı %19 MwSt satırı gösterilmemeli diyor. Founder + muhasebeci kararı, sonra kod düzeltmesi. | `docs/S19-VAT-READINESS.md` | karar + 0.5-1g |
| 14 | **Datenschutz hâlâ "in Hongkong (Verantwortlicher)" diyor** — son Zhenkai kalıntısı; Türkiye (adequacy yok) açıklanmalı. | `lib/site-content.ts` Drittländer bölümü | 15dk |
| 15 | **Checkout'ta AGB/Datenschutz referansı yok** — § 312i BGB bilgi yükümlülüğü B2B'de de geçerli; "Es gelten unsere AGB" + link ekle. | `CheckoutIntakeForm.tsx`, `CustomSizeCheckoutForm.tsx` | 30dk |
| 16 | **Kontakt linki header/footer'da yok** — telefon/e-posta keşfedilemiyor; Türkiye merkezli satıcı için güven kritiği. | `lib/site-content.ts:351-406` | 30dk |
| 17 | **Async ödeme yöntemleri (SEPA vb.) siparişi asla PAID yapmaz** — `async_payment_succeeded` handle edilmiyor. Stripe dashboard'da aktif yöntemleri kontrol et; ya card-only kısıtla ya handler ekle. | `webhook/route.ts:404-435` | 2s |

## P3 — İçerik tutarlılığı (bu hafta, kopya işi)

| # | Sorun | Efor |
|---|-------|------|
| 18 | **3 çelişkili teslimat süresi:** kanonik "15–20 Werktage ab Zahlungseingang" vs "10–14 nach Freigabe" (3 core ürün sayfası + intake + success) vs "7–14" (kalkulator). Tek iddiaya indir. | 2s |
| 19 | **Debug fallback 4 canlı sayfada görünüyor:** "Seitentyp: product / Pfad: /de/..." — /de/pp-rollenetiketten ve yeni /de/bieretiketten-drucken dahil. | 1s |
| 20 | **İç tasarım notları müşteriye görünüyor:** "ohne neue Backend-Funktionen vorzutäuschen", "Diese Phase implementiert noch kein Backend..." vb. guide/service sayfalarında. | 2s |
| 21 | **110/172 içerik bölümü sadece ilk paragrafını render ediyor** (body[0] sorunu) — yazılmış Ratgeber içeriğinin çoğu görünmüyor, SEO değeri çöpe gidiyor. | 1g |
| 22 | **Musterbox çelişkisi:** anasayfa "kostenlos", /de/musterbox FAQ "kostenpflichtig olabilir". + anasayfa "Etikettenpapier" vaat ediyor, kalkulatorda yok. + "Digitaler Proof: 10 EUR" yanlış (digital inklusive, 10€ fiziksel Andruck). | 1s |
| 23 | **Ürün sayfalarında fiyat çapası yok:** packageTable (179/279/479/799€) tanımlı ama hiçbir renderer okumuyor. Reklam trafiği fiyatsız sayfaya düşer. | 2-4s |

## P4 — Reorder sistemi tamamen ölü (marka = "Nachbestellung in 30 Sekunden")

| # | Sorun | Efor |
|---|-------|------|
| 24 | Cron auth yanlış: route APP_SECRET bekliyor, Vercel CRON_SECRET gönderiyor → günlük cron 401. | 30dk |
| 25 | Reminder sorgusu `status: DRAFT` filtreliyor, tek yaratım yolu `PENDING` yazıyor → hiçbir reminder asla gönderilmez. | 30dk |
| 26 | Reminder e-postasındaki CTA ölü link: `/de/kalkulator?reorder=...&ct=...` paramları sayfa tarafından okunmuyor. | 2-4s |
| 27 | `/de/nachbestellen` sayfası quote formuna yönlendiriyor; "Etiketten nachbestellen" butonu da aynı yere gidiyor (etiket yalan söylüyor). ReorderWorkflowBlock'taki "Nachbestellen" butonu onClick'siz. | 1s |

## P5 — Sağlamlaştırma (önümüzdeki 2 hafta)

- Webhook ERROR event'leri alarmsız kalıcı atlanıyor (paid order strand riski) — ADMIN_NOTIFY_EMAIL alarmı ekle. `webhook/route.ts:396-450`
- payment_intent metadata orderId boş → payment_failed no-op; session-id fallback ekle.
- Reorder route'unda Stripe çağrısı try/catch'siz (orphan PENDING_PAYMENT) + shipping adresi alınmıyor.
- Auf-Rechnung başvurusu DB'ye yazılmıyor; e-posta düşerse lead yok olur.
- Telegram chat bildirimi fire-and-forget (serverless'ta düşer); telegram-webhook CHAT_WEBHOOK_SECRET yoksa açık.
- LiveChat consent'siz localStorage `lp_vid` yazıyor (TTDSG tutarsızlığı).
- 6 env var .env.example'da eksik (ADMIN_EMAIL, ENABLE_REORDER_REMINDERS, TELEGRAM_*, CHAT_WEBHOOK_SECRET...); Stripe bölümü hâlâ "(Test Mode)" başlıklı.
- Prisma migrations boş DB'yi bootstrap edemiyor (QuoteRequest/Lead/chat tabloları CREATE TABLE'sız).
- CI sadece dil guard'ı koşuyor; encoding guard + typecheck + 7 test scripti CI'da yok.
- Admin status değişiklikleri (SHIPPED/DELIVERED) müşteri e-postası/timestamp/validation atlıyor.
- /admin-login `?next=` open redirect.
- Manuel/bulk durumda refund handling yok (charge.refunded dinlenmiyor).
- A11y: hata mesajları role="alert"siz, font 10 weight → 2'ye indir, sitemap lastModified=new Date().
- Quote/sample formlarında "Oesterreich/Getraenke" (umlautsız) + Datenschutz linki eksik.
- Ölü kod temizliği: BrandHero, PricingCard, ProductConfigurator, CheckoutButton, homePageData, shadcn artıkları.
- `2 weiteres Design` gramer hatası (`checkout-addons.ts:170`).
- Stale doc'lar (SoT "checkout not live" diyor) — gelecek ajanları yanıltıyor.

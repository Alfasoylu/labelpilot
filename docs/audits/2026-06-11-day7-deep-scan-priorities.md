# Day-7 Deep Scan — Prioritized Task List
**Date:** 2026-06-11 | **Method:** 36-agent full-repo scan (8 subsystems), high-impact findings adversarially verified against code.

---

## P0 — Para kaybettiren / siparişi kıran — ÇÖZÜLDÜ (2026-06-11, commit 6249c59)

| # | Sorun | Durum |
|---|-------|-------|
| 1 | Artwork upload >4.5MB | DONE — Signed-upload-URL akışı: tarayıcı → Supabase direkt PUT, JSON registration gerçek boyutu doğrular, multipart küçük dosya fallback'i. NOT: bucket limiti yok → free tier global 50MB/dosya geçerli; 50MB+ AI/ZIP için plan yükseltmesi gerekebilir. |
| 2 | Admin artwork/proof indirme 401 | DONE — `lib/security/admin-request-auth.ts` Supabase session VEYA Basic-Auth doğrular |
| 3 | Yeni PAID sipariş görünmez | DONE — Webhook ops e-postası (`newOrderOpsNotification`), dashboard "Neu bezahlt" kartı, liste PAID filtresi |
| 4 | **ADMIN_NOTIFY_EMAIL → Hotmail forwarding doğrulanmadı** | AÇIK — founder canlı test yapmalı (10dk). Tüm sipariş/lead alarmları bu hatta. |
| 5 | Designservice +40€ kayboluyor | DONE — Server-side hesap (pricing settings), ayrı Stripe line item, `designServiceCents` order'a yazılıyor |
| 6 | Wunschformat spec kaybı | DONE — `form/klebertyp/uvLack/cornerRadiusMm` kolonları (migration prod'a uygulandı), intake şeması genişletildi, admin detay + üretim devir listesinde görünüyor |

> Bonus: upload token rotasyonu artık client'a dönüyor (aynı oturumda ikinci upload eskiden 403 alırdı); artwork ops e-postası EMAIL_REPLY_TO fallback'i kazandı.
> Önceden kırık testler (temiz main'de de düşüyor, bu işle ilgisiz): `test:safety` (anasayfa PP-money-page link assertion'ı), `test:addons` (ADDONS flag açıkken eski beklenti).

## P1 — Ads açmadan önce (bu hafta, bilinen AW- tag'e ek)

| # | Sorun | Kanıt | Efor |
|---|-------|-------|------|
| ~~7~~ | ~~**Consent Mode 'update' geri dönen ziyaretçide re-fire edilmiyor**~~ → DONE (commit sonrası): inline gtag-init artık consent `default`'unu `lp_consent` cookie'sinden türetiyor (dönen ziyaretçi `granted` başlıyor), ConsentBanner mount'ta `update`'i re-fire ediyor (defense-in-depth). Tarayıcıda 3 yolda da doğrulandı. | `GoogleAnalytics.tsx`, `ConsentBanner.tsx` | ✅ |
| ~~8~~ | ~~**Purchase event webhook yarışını kaybediyor**~~ → DONE: success page artık Stripe `payment_status=paid` ile purchase event'i ateşliyor (DB PAID beklemiyor); teşekkür UI Stripe ödeme onayından, upload CTA DB status'ünden sürülüyor + webhook gecikme penceresinde "link hazırlanıyor" notu. | `checkout/success/page.tsx` | ✅ |
| ~~9~~ | ~~**Canlı funnel'da begin_checkout yok**~~ → DONE: `KalkulatorClient.handleOrder` artık GA4 `begin_checkout` ateşliyor (gross değer, purchase ile aynı baz). Tarayıcıda doğrulandı: value 323.68, items dolu, qty 1000. | `KalkulatorClient.tsx` | ✅ |
| ~~10~~ | ~~**gtag Ads conversion çağrısı guard'sız**~~ → DONE: `window.gtag` varlık kontrolü eklendi (gtagEvent ile aynı). | `lib/analytics/gtag.ts` | ✅ |
| ~~11~~ | ~~**Mobile LCP 4.5–5.3s:** hero görseli iki kez indiriliyor, ikisi de priority~~ → DONE: iki next/image → `<picture>` + `<source media>`. Tarayıcı her viewport'ta tam olarak tek optimize webp'i eager indiriyor, preload rekabeti/çapraz israf yok. İki viewport'ta da doğrulandı (mobil: yalnız banner; desktop: yalnız w=640 portre). | `HeroKalkulator.tsx` | ✅ |
| 12 | **S17 sellability testi hiç koşulmadı** — dokümante pre-Ads go/no-go kapısı; sign-off tablosu boş. P0'lar bitince uçtan uca koş. | `docs/S17-SELLABILITY-TEST-CHECKLIST.md:121-125` | 2-3s manuel |

## P2 — Hukuki / güven (bu hafta)

| # | Sorun | Kanıt | Efor |
|---|-------|-------|------|
| 13 | **VAT çelişkisi:** site her yerde "inkl. 19% MwSt." gösteriyor/tahsil ediyor ama EU/DE VAT kaydı yok ve Impressum "Keine USt-IdNr." diyor — S19 dokümanı %19 MwSt satırı gösterilmemeli diyor. Founder + muhasebeci kararı, sonra kod düzeltmesi. | `docs/S19-VAT-READINESS.md` | karar + 0.5-1g |
| ~~14~~ | ~~**Datenschutz hâlâ "in Hongkong (Verantwortlicher)" diyor**~~ → DONE: Türkei (Alfa Soylu Elektronik, Istanbul) + "kein Angemessenheitsbeschluss" notu. Hongkong tamamen kalktı. | `lib/site-content.ts` | ✅ |
| ~~15~~ | ~~**Checkout'ta AGB/Datenschutz referansı yok**~~ → DONE: her iki checkout formuna submit öncesi "Es gelten unsere AGB" + AGB/Datenschutz linkleri + kostenpflichtig-bestellen ifadesi. Tarayıcıda doğrulandı. | `CheckoutIntakeForm.tsx`, `CustomSizeCheckoutForm.tsx` | ✅ |
| ~~16~~ | ~~**Kontakt linki header/footer'da yok**~~ → DONE: footer Service grubuna Kontakt eklendi. | `lib/site-content.ts` | ✅ |
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

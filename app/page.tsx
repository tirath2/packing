"use client";

import type { CSSProperties, FormEvent } from "react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  contactEmail,
  faqItems,
  getStructuredData,
  serviceCatalog,
  whatsappNumber,
} from "@/lib/seo";

const FORM_ENDPOINT = `https://formsubmit.co/ajax/${contactEmail}`;

const heroImage =
  "https://lh3.googleusercontent.com/aida/AP1WRLtybSRdWK9Huzn9G9oTSCCks0L5ctzWGhNHFroQPEU2x2Q9ArOTigLA0ypeCfaPy8gsypNsNPtL5Duxx-e6Ix0p8lgkTkJhusGseazEty7u28Gqf3-Yd7jt7Wcnwx48V66-0rZellKHBttqkQ-4--EdvVN4JAajH1Ta_HVwUFPvZe59xi67dDJriJMiqog350yOG97lbZXkegSsYc69Yx3aOCM9lCSbYYglw-K2FQ8ELhaYGWkzGkEH9GRl";
const showcaseImage =
  "https://lh3.googleusercontent.com/aida/AP1WRLtWOOpVEHrJscKGPtiHkPtSTtN6QJvw7YVyJpcQsTbjCIXKag80up1C-AD5F9C8NM6_uk9iHVBob5SJo6aEqlsAB5nfuxH6o6h3cMrXY5r-8tUUSfG6Ahons5TVcJwEzhUCFkiTOTgc42reuMXIAB9c6sHDsQItD0HXX2vgkzhG1x-Act_GVUnrIMrDbcrTdjY6HjmlPeo0PWJ2AKVz_68Yc5j1JRpil3xC7sSl7vPgnZVhljnKYpNl-ZYj";
const collectionImage =
  "https://lh3.googleusercontent.com/aida/AP1WRLttPFJBi0qHiWoyCm1QHpi4TdR_nTywcOGv94p6VxAffPwkRWXt3VNDA5c0FizjzTAEVNhgOEQibxBZ0BK3oIZkNtRwljCcLuesbpFIuhp_znXs00k00yAoj9F6a45fQIboicViAlerLb2xEH8DEIcO_z7qyvzJbdEOleeD3MRF6Ricof1zW0vJ0e-YF_mqE0hV4MyD6uLl4SRNaDMIuXr_Bkl1JCKdG2TrccTetrvD5YXCW4YjOddDC_Ma";

const packagingTypes = [
  {
    name: "Custom Burger Boxes",
    value: "Burger Boxes",
    detail: serviceCatalog[0].description,
    icon: BoxIcon,
  },
  {
    name: "Printed Pizza Boxes",
    value: "Pizza Boxes",
    detail: serviceCatalog[1].description,
    icon: SliceIcon,
  },
  {
    name: "Branded Coffee Cups",
    value: "Coffee Cups",
    detail: serviceCatalog[2].description,
    icon: CupIcon,
  },
  {
    name: "Custom Carry Bags",
    value: "Carry Bags",
    detail: serviceCatalog[3].description,
    icon: BagIcon,
  },
];

const steps = [
  ["01", "Share Brand Assets", "Send your logo, menu category and packaging list."],
  ["02", "Receive Mockup", "We create a digital packaging preview for approval."],
  ["03", "Approve Details", "Finalize finish, quantity, size and production notes."],
  ["04", "Print and Deliver", "Your packaging is manufactured and shipped to you."],
];

type FormStatus = "idle" | "submitting" | "success" | "error";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedPackaging, setSelectedPackaging] = useState("Multiple Items");
  const [quantity, setQuantity] = useState(2500);
  const [openFaq, setOpenFaq] = useState(0);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const root = document.documentElement;
    const revealTargets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));

    root.classList.add("scroll-reveal-ready");

    if (!("IntersectionObserver" in window)) {
      revealTargets.forEach((target) => target.setAttribute("data-revealed", "true"));
      return () => root.classList.remove("scroll-reveal-ready");
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-revealed", "true");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.12,
      },
    );

    revealTargets.forEach((target) => observer.observe(target));

    return () => {
      observer.disconnect();
      root.classList.remove("scroll-reveal-ready");
    };
  }, []);

  const whatsappHref = useMemo(() => {
    const message = `Hi, I want custom restaurant packaging. Packaging needed: ${selectedPackaging}. Estimated quantity: ${quantity} units.`;
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  }, [quantity, selectedPackaging]);

  const scrollToForm = (packaging?: string) => {
    if (packaging) {
      setSelectedPackaging(packaging);
    }
    setMenuOpen(false);
    document.getElementById("mockup-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setStatusMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    if (formData.get("_honey")) {
      setStatus("success");
      setStatusMessage("Thanks. We will review the enquiry shortly.");
      form.reset();
      return;
    }

    formData.set("Packaging Needed", selectedPackaging);
    formData.set("Monthly Quantity", `${quantity} units`);
    formData.set("_subject", `Packaging inquiry from ${formData.get("Restaurant Name") || "website"}`);
    formData.set("_template", "table");
    formData.set("_captcha", "false");

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Form service rejected the submission.");
      }

      form.reset();
      setSelectedPackaging("Multiple Items");
      setQuantity(2500);
      setStatus("success");
      setStatusMessage("Inquiry sent. We will reply by email or WhatsApp.");
    } catch {
      setStatus("error");
      setStatusMessage(
        `The email service did not accept the request. Please use WhatsApp or email ${contactEmail}.`,
      );
    }
  };

  return (
    <main className="min-h-screen bg-[#080806] text-[#f7f2e7]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getStructuredData()),
        }}
      />
      <header className="fixed left-0 top-0 z-40 w-full border-b border-white/10 bg-[#080806]/90 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-10">
          <a className="font-serif text-2xl font-semibold uppercase" href="#top" onClick={() => setMenuOpen(false)}>
            Vessel
          </a>
          <div className="hidden items-center gap-7 md:flex">
            <NavLink href="#solutions">Solutions</NavLink>
            <NavLink href="#showcase">Showcase</NavLink>
            <NavLink href="#sustainability">Sustainability</NavLink>
            <NavLink href="#pricing">Pricing</NavLink>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <button className="button button-ghost" type="button" onClick={() => scrollToForm()}>
              Free Mockup
            </button>
            <a className="icon-button" href={whatsappHref} aria-label="Open WhatsApp chat">
              <WhatsAppIcon />
            </a>
          </div>
          <button
            className="icon-button nav-menu-button md:hidden"
            type="button"
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            <MenuIcon open={menuOpen} />
          </button>
        </nav>
        {menuOpen ? (
          <div className="border-t border-white/10 bg-[#0f0f0c] px-5 py-5 md:hidden">
            <div className="flex flex-col gap-4">
              <NavLink href="#solutions" onClick={() => setMenuOpen(false)}>
                Solutions
              </NavLink>
              <NavLink href="#showcase" onClick={() => setMenuOpen(false)}>
                Showcase
              </NavLink>
              <NavLink href="#sustainability" onClick={() => setMenuOpen(false)}>
                Sustainability
              </NavLink>
              <NavLink href="#pricing" onClick={() => setMenuOpen(false)}>
                Pricing
              </NavLink>
              <button className="button button-primary w-full" type="button" onClick={() => scrollToForm()}>
                Free Mockup
              </button>
            </div>
          </div>
        ) : null}
      </header>

      <section id="top" className="relative min-h-[92vh] overflow-hidden">
        <Image
          className="absolute inset-0 h-full w-full object-cover"
          src={heroImage}
          alt="Premium branded restaurant packaging with bags, boxes and cups"
          fill
          priority
          sizes="100vw"
          unoptimized
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,8,6,0.98)_0%,rgba(8,8,6,0.82)_42%,rgba(8,8,6,0.2)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-[linear-gradient(0deg,#080806_0%,rgba(8,8,6,0)_100%)]" />
        <div className="relative mx-auto flex min-h-[92vh] max-w-7xl items-center px-5 pb-24 pt-32 lg:px-10">
          <div className="max-w-3xl">
            <p className="eyebrow text-[#e2c46a]">Restaurant packaging studio</p>
            <h1 className="mt-5 max-w-3xl font-serif text-5xl font-semibold leading-[1.05] text-white sm:text-6xl lg:text-7xl">
              Premium custom packaging for restaurants
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#d8d2c3] sm:text-xl">
              Printed burger boxes, pizza boxes, branded coffee cups, carry bags and custom food packaging for cafes, restaurants, QSRs and cloud kitchens.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button className="button button-primary" type="button" onClick={() => scrollToForm()}>
                Get Free Mockup
              </button>
              <a className="button button-secondary" href={whatsappHref}>
                WhatsApp Quote
              </a>
            </div>
            <dl className="mt-12 grid max-w-2xl grid-cols-3 gap-4 border-y border-white/10 py-5">
              <Stat label="MOQ" value="500+" />
              <Stat label="Mockup" value="24h" />
              <Stat label="Turnaround" value="14d" />
            </dl>
          </div>
        </div>
      </section>

      <section id="solutions" className="section bg-[#080806]" data-reveal>
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <div className="section-heading">
            <p className="eyebrow text-[#b7c7a2]">The Vessel collection</p>
            <h2 className="font-serif text-4xl font-semibold text-white md:text-5xl">
              Custom food packaging solutions for delivery, display and repeat orders
            </h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {packagingTypes.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  className={`product-card text-left ${selectedPackaging === item.value ? "product-card-active" : ""}`}
                  data-reveal="up"
                  style={{ "--reveal-delay": `${index * 90}ms` } as CSSProperties}
                  key={item.name}
                  type="button"
                  onClick={() => scrollToForm(item.value)}
                >
                  <span className="product-icon">
                    <Icon />
                  </span>
                  <span className="mt-5 block text-xl font-semibold text-white">{item.name}</span>
                  <span className="mt-3 block text-sm leading-6 text-[#bdb5a3]">{item.detail}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section id="showcase" className="section border-y border-white/10 bg-[#11110e]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-10">
          <div className="relative h-[440px] overflow-hidden border border-white/10 bg-[#080806]" data-reveal="left">
            <Image
              className="object-cover opacity-90"
              src={showcaseImage}
              alt="Premium branded carry bag and food packaging design"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              unoptimized
            />
          </div>
          <div data-reveal="right">
            <p className="eyebrow text-[#e2c46a]">Brand transformation</p>
            <h2 className="mt-4 font-serif text-4xl font-semibold text-white md:text-5xl">
              Upgrade plain takeaway packaging into a premium customer touchpoint
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#cec7b6]">
              We turn logos, patterns and menu positioning into tactile printed food packaging that looks considered from handoff to unboxing.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Feature title="Print-ready design" text="Artwork is adapted for folds, handles, lids and food-safe surfaces." />
              <Feature title="Material guidance" text="Pick board, kraft, coating and finish based on use case and budget." />
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-[#080806]" data-reveal>
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <div className="section-heading">
            <p className="eyebrow text-[#b7c7a2]">Studio process</p>
            <h2 className="font-serif text-4xl font-semibold text-white md:text-5xl">
              From logo to shipped cartons in four steps
            </h2>
          </div>
          <div className="mt-12 grid gap-7 md:grid-cols-4">
            {steps.map(([number, title, text]) => (
              <article
                className="process-step"
                data-reveal="up"
                key={number}
                style={{ "--reveal-delay": `${Number(number) * 80}ms` } as CSSProperties}
              >
                <span className="font-serif text-5xl text-[#e2c46a]/35">{number}</span>
                <h3 className="mt-5 text-xl font-semibold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#bdb5a3]">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="sustainability" className="section border-y border-white/10 bg-[#182018]" data-reveal>
        <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[0.8fr_1fr] lg:items-center lg:px-10">
          <div data-reveal="left">
            <p className="eyebrow text-[#e2c46a]">Sustainable luxury</p>
            <h2 className="mt-4 font-serif text-4xl font-semibold text-white md:text-5xl">
              Food-safe finishes without disposable-looking design
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3" data-reveal="right">
            <Feature title="FSC paper" text="Responsible paper stocks for bags, sleeves and cartons." />
            <Feature title="Soy inks" text="Cleaner print options for high-coverage brand artwork." />
            <Feature title="Compostable options" text="PLA and kraft combinations for selected food categories." />
          </div>
        </div>
      </section>

      <section id="pricing" className="section bg-[#080806]" data-reveal>
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div data-reveal="left">
              <p className="eyebrow text-[#e2c46a]">Pricing approach</p>
              <h2 className="mt-4 font-serif text-4xl font-semibold text-white md:text-5xl">
                Quote based on material, finish and monthly volume
              </h2>
              <p className="mt-5 text-lg leading-8 text-[#cec7b6]">
                Start with a mockup and packaging list. The final quote reflects size, print coverage, finish, quantity and delivery city.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3" data-reveal="up">
              <PricingTile title="Starter" quantity="500+" description="Single packaging type, one-color or two-color print." />
              <PricingTile title="Growth" quantity="2,500+" description="Multi-item restaurant set with custom design adaptation." />
              <PricingTile title="Premium" quantity="10,000+" description="Advanced finish, inserts, embossing and launch packaging." />
            </div>
          </div>
        </div>
      </section>

      <section id="mockup-form" className="section border-y border-white/10 bg-[#11110e]">
        <div className="mx-auto max-w-5xl px-5 lg:px-10">
          <div className="form-shell" data-reveal="up">
            <div className="h-1 w-full bg-[linear-gradient(90deg,#d7b85b,#f5df97,#9f7b25)]" />
            <div className="grid gap-10 p-6 md:p-10 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="eyebrow text-[#e2c46a]">Free packaging mockup</p>
                <h2 className="mt-4 font-serif text-4xl font-semibold text-white">
                  Send your packaging enquiry
                </h2>
                <p className="mt-5 text-base leading-7 text-[#cec7b6]">
                  Submissions are sent to {contactEmail}. For urgent pricing, open WhatsApp with the same packaging details.
                </p>
                <a className="button button-secondary mt-7 inline-flex" href={whatsappHref}>
                  Chat on WhatsApp
                </a>
              </div>

              <form className="grid gap-5 sm:grid-cols-2" onSubmit={handleSubmit}>
                <input className="hidden" name="_honey" tabIndex={-1} autoComplete="off" />
                <FormField label="Restaurant Name" name="Restaurant Name" placeholder="The Golden Fork" required />
                <FormField label="City" name="City" placeholder="Mumbai" required />
                <FormField label="Email" name="email" placeholder="name@example.com" type="email" required />
                <FormField label="Phone / WhatsApp" name="Phone / WhatsApp" placeholder="7977045133" type="tel" required />
                <label className="field">
                  <span>Packaging Needed</span>
                  <select
                    name="Packaging Needed"
                    value={selectedPackaging}
                    onChange={(event) => setSelectedPackaging(event.target.value)}
                  >
                    <option>Multiple Items</option>
                    {packagingTypes.map((item) => (
                      <option key={item.value}>{item.value}</option>
                    ))}
                    <option>Other Custom Packaging</option>
                  </select>
                </label>
                <label className="field">
                  <span>Monthly Quantity</span>
                  <div className="quantity-value">{quantity.toLocaleString("en-IN")} units</div>
                  <input
                    aria-label="Monthly Quantity"
                    className="range"
                    max="10000"
                    min="500"
                    name="Monthly Quantity"
                    step="500"
                    type="range"
                    value={quantity}
                    onChange={(event) => setQuantity(Number(event.target.value))}
                  />
                </label>
                <label className="field sm:col-span-2">
                  <span>Notes</span>
                  <textarea
                    name="Message"
                    placeholder="Mention box sizes, items, print finish or launch date."
                    rows={4}
                  />
                </label>
                <button className="button button-primary sm:col-span-2" disabled={status === "submitting"} type="submit">
                  {status === "submitting" ? "Sending Enquiry" : "Get Free Packaging Mockup"}
                </button>
                {statusMessage ? (
                  <p
                    className={`sm:col-span-2 text-sm ${
                      status === "error" ? "text-[#ffb4a8]" : "text-[#b7c7a2]"
                    }`}
                    role="status"
                  >
                    {statusMessage}
                  </p>
                ) : null}
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-[#080806]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[1fr_0.9fr] lg:items-start lg:px-10">
          <div data-reveal="left">
            <p className="eyebrow text-[#b7c7a2]">Recent packaging direction</p>
            <div className="relative mt-5 h-[480px] overflow-hidden border border-white/10">
              <Image
                className="object-cover"
                src={collectionImage}
                alt="Assorted premium restaurant packaging products arranged together"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                unoptimized
              />
            </div>
          </div>
          <div data-reveal="right">
            <h2 className="font-serif text-4xl font-semibold text-white">Frequently asked questions</h2>
            <div className="mt-8 divide-y divide-white/10 border-y border-white/10">
              {faqItems.map((item, index) => (
                <div key={item.question}>
                  <button
                    className="flex w-full items-center justify-between gap-4 py-5 text-left text-lg font-semibold text-white"
                    type="button"
                    aria-expanded={openFaq === index}
                    onClick={() => setOpenFaq((current) => (current === index ? -1 : index))}
                  >
                    <span>{item.question}</span>
                    <ChevronIcon open={openFaq === index} />
                  </button>
                  {openFaq === index ? <p className="pb-5 text-sm leading-7 text-[#bdb5a3]">{item.answer}</p> : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#0f0f0c] px-5 py-12 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <div className="font-serif text-3xl font-semibold uppercase text-white">Vessel</div>
            <p className="mt-3 max-w-md text-sm leading-6 text-[#bdb5a3]">
              Premium restaurant packaging design and manufacturing for food brands that care about handoff.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a className="button button-secondary" href={`mailto:${contactEmail}`}>
              Email Enquiry
            </a>
            <a className="button button-primary" href={whatsappHref}>
              WhatsApp
            </a>
          </div>
        </div>
      </footer>

      <a className="floating-whatsapp" href={whatsappHref} aria-label="Open WhatsApp chat">
        <WhatsAppIcon />
      </a>
    </main>
  );
}

function NavLink({
  children,
  href,
  onClick,
}: {
  children: React.ReactNode;
  href: string;
  onClick?: () => void;
}) {
  return (
    <a className="text-sm font-semibold uppercase text-[#d8d2c3] transition hover:text-[#e2c46a]" href={href} onClick={onClick}>
      {children}
    </a>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase text-[#bdb5a3]">{label}</dt>
      <dd className="mt-1 font-serif text-3xl text-white">{value}</dd>
    </div>
  );
}

function Feature({ title, text }: { title: string; text: string }) {
  return (
    <article className="feature-box">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-[#bdb5a3]">{text}</p>
    </article>
  );
}

function PricingTile({ title, quantity, description }: { title: string; quantity: string; description: string }) {
  return (
    <article className="pricing-tile">
      <p className="text-sm uppercase text-[#bdb5a3]">{title}</p>
      <p className="mt-3 font-serif text-4xl text-[#e2c46a]">{quantity}</p>
      <p className="mt-4 text-sm leading-6 text-[#cec7b6]">{description}</p>
    </article>
  );
}

function FormField({
  label,
  name,
  placeholder,
  required,
  type = "text",
}: {
  label: string;
  name: string;
  placeholder: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input name={name} placeholder={placeholder} required={required} type={type} />
    </label>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24">
      {open ? (
        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      ) : (
        <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      )}
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
      <path
        d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.5 0 .2 5.3.2 11.9c0 2.1.5 4.1 1.6 5.9L0 24l6.3-1.6a11.9 11.9 0 0 0 5.7 1.4h.1c6.5 0 11.9-5.3 11.9-11.9a11.8 11.8 0 0 0-3.5-8.4Zm-8.4 18.3A9.9 9.9 0 0 1 7 20.4l-.4-.2-3.7 1 1-3.7-.2-.4a9.9 9.9 0 0 1-1.5-5.2C2.2 6.4 6.6 2 12.1 2c2.6 0 5.1 1 7 2.9a9.8 9.8 0 0 1 2.9 7c0 5.5-4.4 9.9-9.9 9.9Zm5.4-7.4c-.3-.1-1.8-.9-2-.9-.3-.1-.5-.2-.7.1l-.9 1.2c-.2.2-.4.2-.7.1a8.1 8.1 0 0 1-2.4-1.5 9 9 0 0 1-1.7-2.1c-.2-.3 0-.5.1-.6l.5-.5.3-.5c.1-.2.1-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.4Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg aria-hidden="true" className={`h-5 w-5 text-[#e2c46a] transition ${open ? "rotate-180" : ""}`} viewBox="0 0 24 24">
      <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg aria-hidden="true" className="h-10 w-10" viewBox="0 0 48 48">
      <path d="M8 16 24 8l16 8-16 8L8 16Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" />
      <path d="M8 16v17l16 7 16-7V16M24 24v16" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function SliceIcon() {
  return (
    <svg aria-hidden="true" className="h-10 w-10" viewBox="0 0 48 48">
      <path d="M10 38 24 8l14 30H10Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" />
      <path d="M16 30h16M20 22h8" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      <circle cx="23" cy="31" r="2" fill="currentColor" />
      <circle cx="26" cy="22" r="2" fill="currentColor" />
    </svg>
  );
}

function CupIcon() {
  return (
    <svg aria-hidden="true" className="h-10 w-10" viewBox="0 0 48 48">
      <path d="M16 15h16l-2 25H18L16 15ZM14 8h20v7H14V8Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" />
      <path d="M18 24h12" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg aria-hidden="true" className="h-10 w-10" viewBox="0 0 48 48">
      <path d="M12 17h24l-2 23H14L12 17Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" />
      <path d="M18 17c0-5 3-8 6-8s6 3 6 8" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}

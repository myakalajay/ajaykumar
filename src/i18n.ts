import { useEffect, useState } from 'react';

/**
 * Language + region auto-detection.
 *
 * Two sources, resolved in priority order:
 *   1. navigator.language / languages  — what the browser/OS is set to (most accurate).
 *   2. The Worker's /api/geo endpoint  — Cloudflare's country + a language derived from it,
 *      used only if the browser reports nothing usable (rare) or to surface the detected country.
 *
 * This is intentionally lightweight: the site copy stays in English (it's a personal
 * portfolio), and the locale drives the localized greeting and is reported to the
 * admin analytics so you can see where in the world visitors are reading from.
 */

export type Locale = {
  /** ISO-639-1 language code, lowercased — e.g. 'en', 'ar', 'ja'. */
  lang: string;
  /** ISO-3166-1 alpha-2 country code from Cloudflare, uppercased — e.g. 'AE', 'JP'. Null if unknown. */
  country: string | null;
  /** True once resolved from either source. */
  ready: boolean;
};

/** Greeting per language, keyed by ISO-639-1 code. Fallbacks to 'hello'. */
const GREETINGS: Record<string, string> = {
  en: 'Hello',
  ar: 'مرحبا',
  ja: 'こんにちは',
  ko: '안녕하세요',
  zh: '你好',
  de: 'Hallo',
  fr: 'Bonjour',
  es: 'Hola',
  pt: 'Olá',
  it: 'Ciao',
  nl: 'Hallo',
  ru: 'Привет',
  tr: 'Merhaba',
  he: 'שלום',
  hi: 'नमस्ते',
  sv: 'Hej',
  no: 'Hei',
  da: 'Hej',
  fi: 'Moi',
  pl: 'Cześć',
  cs: 'Ahoj',
  vi: 'Xin chào',
  th: 'สวัสดี',
  id: 'Halo',
};

/** Country → language, used only when the browser reports no language at all. */
const COUNTRY_LANG: Record<string, string> = {
  AE: 'ar', SA: 'ar', QA: 'ar', KW: 'ar', OM: 'ar', BH: 'ar', JO: 'ar', EG: 'ar',
  JP: 'ja', KR: 'ko', CN: 'zh', TW: 'zh', HK: 'zh',
  DE: 'de', AT: 'de', CH: 'de', FR: 'fr', BE: 'fr', ES: 'es', MX: 'es', AR: 'es', CL: 'es', CO: 'es',
  PT: 'pt', BR: 'pt', IT: 'it', NL: 'nl', RU: 'ru', TR: 'tr', IL: 'he',
  IN: 'en', US: 'en', GB: 'en', CA: 'en', AU: 'en', NZ: 'en', IE: 'en', ZA: 'en', SG: 'en',
  SE: 'sv', NO: 'no', DA: 'da', DK: 'da', FI: 'fi', PL: 'pl', CZ: 'cs', VN: 'vi', TH: 'th', ID: 'id',
};

function normLang(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const code = raw.trim().toLowerCase().split(/[-_]/)[0];
  return /^[a-z]{2,3}$/.test(code) ? code : null;
}

/** The localized greeting for a language code, falling back to 'Hello'. */
export function greetingFor(lang: string): string {
  return GREETINGS[lang] ?? GREETINGS.en;
}

/** Human label for a language code — shown on the greeting chip. */
export function langLabel(lang: string): string {
  const names: Record<string, string> = {
    en: 'English', ar: 'العربية', ja: '日本語', ko: '한국어', zh: '中文', de: 'Deutsch',
    fr: 'Français', es: 'Español', pt: 'Português', it: 'Italiano', nl: 'Nederlands',
    ru: 'Русский', tr: 'Türkçe', he: 'עברית', hi: 'हिन्दी', sv: 'Svenska', no: 'Norsk',
    da: 'Dansk', fi: 'Suomi', pl: 'Polski', cs: 'Čeština', vi: 'Tiếng Việt',
    th: 'ไทย', id: 'Bahasa Indonesia',
  };
  return names[lang] ?? lang.toUpperCase();
}

/**
 * Detects the visitor's locale. Resolves synchronously from the browser language on
 * first render, then refines with the Worker's geo lookup (adds the country and can
 * correct the language when the browser reports nothing). Best-effort: never throws.
 */
export function useLocale(): Locale {
  const [locale, setLocale] = useState<Locale>(() => ({
    lang: normLang(navigator.language) ?? 'en',
    country: null,
    ready: false,
  }));

  useEffect(() => {
    let cancelled = false;

    // Prefer the browser's own language list — no network needed.
    const browserLang = normLang(navigator.languages?.[0] ?? navigator.language);

    fetch('/api/geo', { headers: { accept: 'application/json' } })
      .then((r) => (r.ok ? r.json() : null))
      .then((geo: { country?: string | null; lang?: string | null } | null) => {
        if (cancelled) return;
        const country = geo?.country?.toUpperCase() ?? null;
        const lang = browserLang ?? normLang(geo?.lang) ?? (country ? COUNTRY_LANG[country] : null) ?? 'en';
        setLocale({ lang, country, ready: true });
      })
      .catch(() => {
        // Offline / dev without a Worker — the browser language still stands.
        if (!cancelled) setLocale((l) => ({ ...l, ready: true }));
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return locale;
}

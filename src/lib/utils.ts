
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type Language = "de" | "en" | "tr";

export const languages = {
  de: "Deutsch",
  en: "English",
  tr: "Türkçe"
} as const;

export const translations = {
  de: {
    overview: "Gesamtübersicht",
    kpiDescription: "Alle wichtigen KPIs auf einen Blick.",
    websitePerformance: "Website Performance",
    websiteVisitors: "Website Besucher",
    pageViews: "Seitenaufrufe",
    activeForms: "Aktive Formulare",
    discoveredPages: "Erfasste Seiten",
    onAllPages: "Auf allen Seiten",
    autoDetected: "Automatisch erkannt",
    vsLastMonth: "vs. letzter Monat",
    socialMedia: "Social Media Performance",
    organicReach: "Organic Reach",
    socialEngagement: "Social Engagement",
    adImpressions: "Ad Impressionen",
    socialROI: "Social ROI",
    vsLastWeek: "vs. letzte Woche",
    vsLastQuarter: "vs. letztes Quartal",
    googleAds: "Google Ads Performance",
    clicks: "Klicks",
    impressions: "Impressionen",
    ctr: "CTR",
    conversionRate: "Conversion Rate"
  },
  en: {
    overview: "Overview",
    kpiDescription: "All important KPIs at a glance.",
    websitePerformance: "Website Performance",
    websiteVisitors: "Website Visitors",
    pageViews: "Page Views",
    activeForms: "Active Forms",
    discoveredPages: "Discovered Pages",
    onAllPages: "On all pages",
    autoDetected: "Automatically detected",
    vsLastMonth: "vs. last month",
    socialMedia: "Social Media Performance",
    organicReach: "Organic Reach",
    socialEngagement: "Social Engagement",
    adImpressions: "Ad Impressions",
    socialROI: "Social ROI",
    vsLastWeek: "vs. last week",
    vsLastQuarter: "vs. last quarter",
    googleAds: "Google Ads Performance",
    clicks: "Clicks",
    impressions: "Impressions",
    ctr: "CTR",
    conversionRate: "Conversion Rate"
  },
  tr: {
    overview: "Genel Bakış",
    kpiDescription: "Tüm önemli KPI'lar bir bakışta.",
    websitePerformance: "Web Sitesi Performansı",
    websiteVisitors: "Web Sitesi Ziyaretçileri",
    pageViews: "Sayfa Görüntülemeleri",
    activeForms: "Aktif Formlar",
    discoveredPages: "Keşfedilen Sayfalar",
    onAllPages: "Tüm sayfalarda",
    autoDetected: "Otomatik algılandı",
    vsLastMonth: "geçen aya göre",
    socialMedia: "Sosyal Medya Performansı",
    organicReach: "Organik Erişim",
    socialEngagement: "Sosyal Etkileşim",
    adImpressions: "Reklam Gösterimleri",
    socialROI: "Sosyal ROI",
    vsLastWeek: "geçen haftaya göre",
    vsLastQuarter: "geçen çeyreğe göre",
    googleAds: "Google Ads Performansı",
    clicks: "Tıklamalar",
    impressions: "Gösterimler",
    ctr: "TTO",
    conversionRate: "Dönüşüm Oranı"
  }
} as const;

export function getStoredLanguage(): Language {
  return (localStorage.getItem("language") as Language) || "de";
}

export function setStoredLanguage(lang: Language) {
  localStorage.setItem("language", lang);
}

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { en, zh } from './resources'

const LOCALE_KEY = 'sub2api_locale'

function detectLocale(): 'en' | 'zh' {
  try {
    const saved = localStorage.getItem(LOCALE_KEY)
    if (saved === 'en' || saved === 'zh') return saved
  } catch {
    /* ignore */
  }
  if (typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('zh')) {
    return 'zh'
  }
  return 'en'
}

export function setLocale(locale: 'en' | 'zh') {
  try {
    localStorage.setItem(LOCALE_KEY, locale)
  } catch {
    /* ignore */
  }
  void i18n.changeLanguage(locale)
  document.documentElement.setAttribute('lang', locale)
}

export function getLocale(): string {
  return i18n.language || 'en'
}

const initial = detectLocale()

void i18n.use(initReactI18next).init({
  resources: { en, zh },
  lng: initial,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

document.documentElement.setAttribute('lang', initial)

export default i18n

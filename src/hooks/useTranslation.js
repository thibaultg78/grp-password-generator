import { useState, useEffect } from 'react'

/**
 * Custom hook for managing translations and language switching
 * Supports French (fr) and English (en) languages
 */
export function useTranslation() {
    // Initialize language state from localStorage or default to French
    const [language, setLanguageState] = useState(() => {
        const saved = localStorage.getItem('language')
        return saved || 'fr'
    })

    // State to store the current translation object
    const [translations, setTranslations] = useState({})

    // Effect to handle language changes and load translation files
    useEffect(() => {
        // Persist the current language to localStorage
        localStorage.setItem('language', language)

        // Dynamic loading of the JSON translation file
        import(`../locales/${language}.json`)
            .then((module) => setTranslations(module.default))
            .catch((err) => console.error('Language loading error:', err))
    }, [language])

    /**
     * Translation function that returns the translated text for a given key
     * @param {string} key - The translation key
     * @returns {string} The translated text or the key itself if not found
     */
    const t = (key) => {
        return translations[key] || key
    }

    /**
     * Sets the application language if it's supported
     * @param {string} lang - Language code ('fr' or 'en')
     */
    const setLanguage = (lang) => {
        if (['fr', 'en'].includes(lang)) {
            setLanguageState(lang)
        }
    }

    // Return the translation function, current language, and language setter
    return { t, language, setLanguage }
}
const locale = { ar: true, en: true, fa: true };

type Locale = typeof locale;

type LocaleKeys = keyof Locale;

export interface MyObject {
    locale?: LocaleKeys;
}

const translations = {
    Language: { bg: "Език", en: "Language" },
    changeLanguage: { bg: "Премини на", en: "Switch to" },
    save: { bg: "Запомни", en: "Save" },
    load: { bg: "Зареди", en: "Load" },
    exit: { bg: "Изход", en: "Exit" },
    menu: { bg: "Меню", en: "Menu" },
    transfer: { bg: "запис", en: "transfer" },
    closeWindow: { bg: "Да затворя ли прозореца?", en: "Close window?" },
    notChoosen: { bg: "не е избрана", en: "not choosen" },
    reload: { bg: "Презареди", en: "Reload" },
    loading: { bg: "Зареждане...", en: "Loading..." },
    product: { bg: "стока", en: "product" },
    connectionError: { bg: "Възможен проблем с мрежата! ", en: "Connection might have been lost! " },
    remove: { bg: "Изтрий", en: "Remove" },

    general_terms: { bg: "Доставка и плащания", en: "Delivery and payment" },
    free_subdomain: { bg: "домейн е предоставен безплатно от", en: "free subdomain provided by" },
};

const Translation = () => {
    const getLangs = () => [
        {
            title: "Български",
            short: "БГ",
            id: "bg",
        },
        {
            title: "English",
            short: "EN",
            id: "en",
        },
    ];

    const t = (lang, key) => {
        let k = translations[key];
        if (!k) {
            return "Not found translation key";
        }
        let t = k[lang];
        if (!t) {
            return "Not found translation language";
        }

        return t;
    };
    return {
        getLangs,
        t,
    };
};

export default Translation();

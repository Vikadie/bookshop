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

    book_shop: { bg: 'Магазин за книги "Мраволак"', en: 'Book shop "Mravolak"' },
    profile: { bg: "Профил", en: "Profile" },
    logout: { bg: "Изход", en: "Logout" },
    login: { bg: "Вход", en: "Login" },
    users: { bg: "Потребители", en: "Users" },
    products: { bg: "Продукти", en: "Products" },
    orders: { bg: "Поръчки", en: "Orders" },
    cart: { bg: "Кошница", en: "Cart" },
    search: { bg: "Търси", en: "Search" },
    general_terms: { bg: "Общи Условия", en: "General terms" },
    privacy_policy: { bg: "Политика за личните данни", en: "Privacy Policy" },
    sales_terms: { bg: "Доставка и плащания", en: "Delivery and payment" },
    free_subdomain: { bg: "домейн е предоставен безплатно от", en: "free subdomain provided by" },
    unsubscribe_sorry: {
        bg: "Съжаляваме, че си отивате! Това е малко изненадващо, тъй като правим всичко възможно да изпращаме възможно най-малко имейли - само тези, свързани с вашите поръчки. Така че може би сте тук по погрешка?",
        en: "We are sorry to see you go! It is surprising a bit, as we do our best to send as least as possible e-mails - only those linked with your orders. So, maybe you are here by mistake?",
    },
    unsubscribe_error: {
        bg: "...ако е така, просто затворете тази страница или се върнете в магазина.",
        en: "...if so, just close this page or move back to the store.",
    },
    unsubscribe_noerror: {
        bg: "...ако не, трябва да направите още нещо, за да потвърдите волята си.",
        en: "...if not, you need to do one more thing to confirm your will.",
    },
    unsubscribe_fillmail: {
        bg: "Моля, попълнете своя e-mail",
        en: "Please, fill-in you e-mail",
    },
    unsubscribe_confirm: {
        bg: "Потвърдете отписването",
        en: "Confirm unsubscribe",
    },
    unsubscribe_final: {
        bg: "Ще получите един последен имейл, за да потвърдите, че сме прекратили абонамента ви. Благодаря, че се помотахте с нас!",
        en: "You'll receive one final email to confirm that we unsubscribed you. Thanks for hanging out with us!",
    },
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

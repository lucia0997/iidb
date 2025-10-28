import i18n, { InitOptions } from "i18next";
import enLogin from "./en/login/login.json"
import enAdminPanel from "./en/admin_panel/admin_panel.json"
import esLogin from "./es/login/login.json"
import esAdminPanel from "./es/admin_panel/admin_panel.json"
import frLogin from "./fr/login/login.json"
import frAdminPanel from "./fr/admin_panel/admin_panel.json"
import deLogin from "./de/login/login.json"
import deAdminPanel from "./de/admin_panel/admin_panel.json"
import { initReactI18next } from "react-i18next";

const options: InitOptions = {
    resources: {
        en: {
            login: enLogin,
            admin_panel: enAdminPanel,
        },
        es: {
            login: esLogin,
            admin_panel: esAdminPanel,
        },
        fr: {
            login: frLogin,
            admin_panel: frAdminPanel,
        },
        de: {
            login: deLogin,
            admin_panel: deAdminPanel,
        },
    },
    ns: ['login', 'admin_panel'],
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
};

i18n.use(initReactI18next).init(options)
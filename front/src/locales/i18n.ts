import i18n, { InitOptions } from "i18next";
import enLogin from "./en/login/login.json"
import enAdminPanel from "./en/admin_panel/admin_panel.json"
import enResultsTable from "./en/results_table/results_table.json"
import esLogin from "./es/login/login.json"
import esAdminPanel from "./es/admin_panel/admin_panel.json"
import esResultsTable from "./es/results_table/results_table.json"
import frLogin from "./fr/login/login.json"
import frAdminPanel from "./fr/admin_panel/admin_panel.json"
import frResultsTable from "./fr/results_table/results_table.json"
import deLogin from "./de/login/login.json"
import deAdminPanel from "./de/admin_panel/admin_panel.json"
import deResultsTable from "./de/results_table/results_table.json"
import { initReactI18next } from "react-i18next";

const options: InitOptions = {
    resources: {
        en: {
            login: enLogin,
            admin_panel: enAdminPanel,
            results_table: enResultsTable
        },
        es: {
            login: esLogin,
            admin_panel: esAdminPanel,
            results_table: esResultsTable
        },
        fr: {
            login: frLogin,
            admin_panel: frAdminPanel,
            results_table: frResultsTable
        },
        de: {
            login: deLogin,
            admin_panel: deAdminPanel,
            results_table: deResultsTable,
        },
    },
    ns: ['login', 'admin_panel', 'results_table'],
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
};

i18n.use(initReactI18next).init(options)
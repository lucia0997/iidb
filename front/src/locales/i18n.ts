import i18n, { InitOptions } from "i18next";
import enLogin from "./en/login/login.json"
import enAdminPanel from "./en/admin_panel/admin_panel.json"
import enResultsTable from "./en/results_table/results_table.json"
import enCreateDB from "./en/create_db/create_db.json"
import enMainMenu from "./en/main_menu/main_menu.json"
import enIndustrialDB from "./en/industrial_db/industrial_db.json"
import esLogin from "./es/login/login.json"
import esAdminPanel from "./es/admin_panel/admin_panel.json"
import esResultsTable from "./es/results_table/results_table.json"
import esCreateDB from "./es/create_db/create_db.json"
import esMainMenu from "./es/main_menu/main_menu.json"
import esIndustrialDB from "./es/industrial_db/industrial_db.json"
import frLogin from "./fr/login/login.json"
import frAdminPanel from "./fr/admin_panel/admin_panel.json"
import frResultsTable from "./fr/results_table/results_table.json"
import frCreateDB from "./fr/create_db/create_db.json"
import frMainMenu from "./fr/main_menu/main_menu.json"
import frIndustrialDB from "./fr/industrial_db/industrial_db.json"
import deLogin from "./de/login/login.json"
import deAdminPanel from "./de/admin_panel/admin_panel.json"
import deResultsTable from "./de/results_table/results_table.json"
import deCreateDB from "./de/create_db/create_db.json"
import deMainMenu from "./de/main_menu/main_menu.json"
import deIndustrialDB from "./de/industrial_db/industrial_db.json"
import { initReactI18next } from "react-i18next";

const options: InitOptions = {
    resources: {
        en: {
            login: enLogin,
            admin_panel: enAdminPanel,
            results_table: enResultsTable,
            create_db: enCreateDB,
            main_menu: enMainMenu,
            industrial_db: enIndustrialDB
        },
        es: {
            login: esLogin,
            admin_panel: esAdminPanel,
            results_table: esResultsTable,
            create_db: esCreateDB,
            main_menu: esMainMenu,
            industrial_db: esIndustrialDB
        },
        fr: {
            login: frLogin,
            admin_panel: frAdminPanel,
            results_table: frResultsTable,
            create_db: frCreateDB,
            main_menu: frMainMenu,
            industrial_db: frIndustrialDB
        },
        de: {
            login: deLogin,
            admin_panel: deAdminPanel,
            results_table: deResultsTable,
            create_db: deCreateDB,
            main_menu: deMainMenu,
            industrial_db: deIndustrialDB
        },
    },
    ns: ['login', 'admin_panel', 'results_table', 'create_db', 'main_menu', 'industrial_db'],
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
};

i18n.use(initReactI18next).init(options)
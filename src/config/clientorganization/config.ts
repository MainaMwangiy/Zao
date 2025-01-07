import utils from "../../utils";
import { ModuleConfig } from "./types";

export const clientOrganizationConfig: ModuleConfig = {
    keyField: "Clientorganization",
    title: "Clientorganization",
    showTitle: true,
    isImport: true,
    isExport: true,
    hideActionMenu: true,
    apiEndpoints: {
        list: {
            url: `${utils.baseUrl}/api/clientorganizations/list`
        },
        create: {
            url: `${utils.baseUrl}/api/clientorganizations/create`
        },
        update: {
            url: `${utils.baseUrl}/api/clientorganizations/update`
        },
        delete: {
            url: `${utils.baseUrl}/api/clientorganizations/delete`,
        },
        total: {
            url: `${utils.baseUrl}/api/harvests/total`
        }
    },
    fields: [
        { name: "name", type: "text", label: "Organization Name", width: "200px" },
        { name: "appconfig", type: "json", label: "Config", width: "150px"},
    ],
};

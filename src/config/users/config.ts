import utils from "../../utils";
import { ModuleConfig } from "./types";

const clientorganizationid = localStorage.getItem('clientorganizationid') || "";
const user = localStorage.getItem('clientuser') || "{}";
const clientuser = JSON.parse(user);
const clientuserid = clientuser?.clientuserid;

export const usersConfig : ModuleConfig = {
    title: "Users",
    showTitle: true,
    showTotal: false,
    isImport: false,
    isExport: true,
    apiEndpoints: {
        list: {
            url: `${utils.baseUrl}/api/auth/list`,
        },
        create: {
            url: `${utils.baseUrl}/api/auth/create`,
            payload: {
                clientorganizationid,
                createdbyuserid: clientuserid,
                modifiedbyuserid: clientuserid
            }
        },
        update: {
            url: `${utils.baseUrl}/api/auth/update`,
            payload: {
                clientorganizationid,
                modifiedbyuserid: clientuserid
            }
        },
        delete: {
            url: `${utils.baseUrl}/api/auth/delete`
        }
    },
    fields: [
        { name: 'name', type: 'text', label: 'Name', width: '150px' },
        { name: 'location', type: 'text', label: 'Location', width: '150px' },
        { name: 'status', type: 'text', label: 'Status', width: '100px' },
        { name: 'role', type: 'text', label: 'Role', width: '150px' }
    ]
};

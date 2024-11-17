import utils from "../../utils";
import { ModuleConfig } from "./types";

const clientorganizationid = localStorage.getItem('clientorganizationid') || "";
const user = localStorage.getItem('clientuser') || "{}";
const clientuser = JSON.parse(user);
const clientuserid = clientuser?.clientuserid;
const clientusers = localStorage.getItem('clientuser') || '';
const roles = JSON.parse(clientusers);

export const usersConfig: ModuleConfig = {
    keyField: "User",
    title: "Users",
    showTitle: true,
    showTotal: false,
    isImport: false,
    isExport: true,
    apiEndpoints: {
        list: {
            url: `${utils.baseUrl}/api/auth/list`,
            payload: {
                clientorganizationid: clientorganizationid,
                roleid: roles?.roleid
            }
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
        },
        total: {
            url: `${utils.baseUrl}/api/harvests/total`,
            payload: {
                clientorganizationid: clientorganizationid
            }
        }
    },
    fields: [
        { name: 'name', type: 'text', label: 'Name', width: '150px' },
        { name: 'location', type: 'text', label: 'Location', width: '150px' },
        { name: 'status', type: 'text', label: 'Status', width: '100px' },
        { name: 'roleid', type: 'select', label: 'Role', width: '150px', options: ["superadmin", "admin", "user"] }
    ]
};

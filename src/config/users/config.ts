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
    isImport: false,
    isExport: true,
    apiEndpoints: {
        list: {
            url: `${utils.baseUrl}/api/auth/list`,
            payload: {
                clientorganizationid: clientorganizationid,
                roleid: roles?.roleid
            },
            hideProject: true
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
        {
            name: 'name', type: 'text', label: 'Name', width: '150px',
            // getCustomClass: (item) => item.status === 'active' ? 'text-green-500' : 'text-red-500', example of how changing colors should be done
            // onEvent: (item) => alert(`Name clicked: ${item.name}`), Show on Click how it will look like
        },
        { name: 'email', type: 'string', label: 'Email', width: '100px' },
        { name: 'location', type: 'text', label: 'Location', width: '150px' },
        { name: 'status', type: 'select', label: 'Status', width: '100px', options: ["active", "inactive"] },
        {
            name: 'roleid', type: 'select', label: 'Role', width: '150px', options: ["superadmin", "admin", "user"], passKeyField: true, convertValue: (value) => utils.getRoles(parseInt(value)) || "",
            getCustomClass: (item) => {
                const role = utils.getRoles(parseInt(item.roleid));
                switch (role) {
                    case 'SuperAdmin':
                        return 'text-red-500';
                    case 'Admin':
                        return 'text-blue-500';
                    case 'User':
                        return 'text-green-500';
                    default:
                        return '';
                }
            }
        },
        { name: 'password', type: 'password', label: 'Password', width: '100px', hide: true }
    ]
};

import utils from "../../utils";
import { ModuleConfig } from "./types";

const clientorganizationid = localStorage.getItem('clientorganizationid') || "";

export const harvestsConfig: ModuleConfig = {
    title: "Harvests",
    showTitle: true,
    showTotal: true,
    isImport: true,
    isExport: true,
    apiEndpoints: {
        list: {
            url: `${utils.baseUrl}/api/harvests/list`,
            payload: {
                clientorganizationid
            }
        },
        create: {
            url: `${utils.baseUrl}/api/harvests/create`,
            payload: {
                clientorganizationid
            }
        },
        update: {
            url: `${utils.baseUrl}/api/harvests/update`,
            payload: {
                clientorganizationid
            }
        },
        delete: {
            url: `${utils.baseUrl}/api/harvests/delete`
        }
    },
    fields: [
        { name: 'bags', type: 'number', label: 'BAGS', width: '150px' },
        { name: 'unitPrice', type: 'number', label: 'UNIT PRICE', width: '150px' },
        { name: 'amountSold', type: 'number', label: 'AMOUNT SOLD', width: '150px' },
        { name: 'notes', type: 'text', label: 'NOTES', width: '300px' }
    ]
};

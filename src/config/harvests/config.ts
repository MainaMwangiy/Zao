import utils from "../../utils";
import { ModuleConfig } from "./types";

const clientuserid = localStorage.getItem("clientuserid") || "";

export const harvestsConfig: ModuleConfig = {
    keyField: 'Harvest',
    title: "Harvests",
    showTitle: true,
    isImport: true,
    isExport: true,
    apiEndpoints: {
        list: {
            url: `${utils.baseUrl}/api/harvests/list`
        },
        create: {
            url: `${utils.baseUrl}/api/harvests/create`,
            payload: {
                harvestid: 0,
                createdbyuserid: clientuserid,
                modifiedbyuserid: clientuserid
            }
        },
        update: {
            url: `${utils.baseUrl}/api/harvests/update`,
            payload: {
                createdbyuserid: clientuserid,
                modifiedbyuserid: clientuserid
            }
        },
        delete: {
            url: `${utils.baseUrl}/api/harvests/delete`
        },
        total: {
            url: `${utils.baseUrl}/api/harvests/total`
        }
    },
    fields: [
        { name: 'bags', type: 'number', label: 'Bags', width: '150px' },
        { name: 'unitprice', type: 'number', label: 'Unit Price', width: '150px' },
        { name: 'amountsold', type: 'number', label: 'Amount Sold', width: '150px', getCustomClass: (item) => item.amountsold > 10000 ? 'text-yellow-500' : '' },
        { name: 'notes', type: 'text', label: 'Notes', width: '300px' }
    ]
};

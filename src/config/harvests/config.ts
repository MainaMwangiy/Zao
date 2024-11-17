import utils from "../../utils";
import { ModuleConfig } from "./types";

const clientorganizationid = localStorage.getItem('clientorganizationid') || "";
const clientuserid = localStorage.getItem("clientuserid") || "";

export const harvestsConfig: ModuleConfig = {
    keyField: 'Harvest',
    title: "Harvests",
    showTitle: false,
    showTotal: true,
    isImport: true,
    isExport: true,
    apiEndpoints: {
        list: {
            url: `${utils.baseUrl}/api/harvests/list`,
            payload: {
                clientorganizationid: clientorganizationid
            }
        },
        create: {
            url: `${utils.baseUrl}/api/harvests/create`,
            payload: {
                harvestid: 0,
                createdbyuserid: clientuserid,
                modifiedbyuserid: clientuserid,
                clientorganizationid: clientorganizationid
            }
        },
        update: {
            url: `${utils.baseUrl}/api/harvests/update`,
            payload: {
                createdbyuserid: clientuserid,
                modifiedbyuserid: clientuserid,
                clientorganizationid: clientorganizationid
            }
        },
        delete: {
            url: `${utils.baseUrl}/api/harvests/delete`,
            payload: {
                clientorganizationid: clientorganizationid
            }
        },
        total: {
            url: `${utils.baseUrl}/api/harvests/total`,
            payload: {
                clientorganizationid: clientorganizationid
            }
        }
    },
    fields: [
        { name: 'bags', type: 'number', label: 'Bags', width: '150px' },
        { name: 'unitprice', type: 'number', label: 'Unit Price', width: '150px' },
        { name: 'amountsold', type: 'number', label: 'Amount Sold', width: '150px' },
        { name: 'notes', type: 'text', label: 'Notes', width: '300px' }
    ]
};

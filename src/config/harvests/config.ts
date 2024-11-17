import utils from "../../utils";
import { ModuleConfig } from "./types";

const clientorganizationid = localStorage.getItem('clientorganizationid') || "";
const clientuserid = localStorage.getItem("clientuserid") || "";
const projectid = window.location.pathname.split('/').pop() || "";

export const harvestsConfig: ModuleConfig = {
    keyField: 'Harvest',
    title: "Harvests",
    showTitle: true,
    showTotal: true,
    isImport: true,
    isExport: false,
    apiEndpoints: {
        list: {
            url: `${utils.baseUrl}/api/harvests/list`,
            payload: {
                clientorganizationid: clientorganizationid,
                projectid: projectid
            }
        },
        create: {
            url: `${utils.baseUrl}/api/harvests/create`,
            payload: {
                harvestid: 0,
                createdbyuserid: clientuserid,
                modifiedbyuserid: clientuserid,
                clientorganizationid: clientorganizationid,
                projectid: projectid
            }
        },
        update: {
            url: `${utils.baseUrl}/api/harvests/update`,
            payload: {
                createdbyuserid: clientuserid,
                modifiedbyuserid: clientuserid,
                clientorganizationid: clientorganizationid,
                projectid: projectid
            }
        },
        delete: {
            url: `${utils.baseUrl}/api/harvests/delete`,
            payload: {
                clientorganizationid: clientorganizationid,
                projectid: projectid
            }
        },
        total: {
            url: `${utils.baseUrl}/api/harvests/total`,
            payload: {
                clientorganizationid: clientorganizationid,
                projectid: projectid
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

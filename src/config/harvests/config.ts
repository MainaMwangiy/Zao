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
                clientorganizationid: clientorganizationid
            }
        }
    },
    fields: [
        { name: 'bags', type: 'number', label: 'BAGS', width: '150px' },
        { name: 'unitprice', type: 'number', label: 'UNIT PRICE', width: '150px' },
        { name: 'amountsold', type: 'number', label: 'AMOUNT SOLD', width: '150px' },
        { name: 'notes', type: 'text', label: 'NOTES', width: '300px' }
    ]
};

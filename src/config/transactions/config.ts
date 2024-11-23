import utils from "../../utils";
import { ModuleConfig } from "../harvests/types";

const clientorganizationid = localStorage.getItem('clientorganizationid') || "";
const clientOrganizationId = localStorage.getItem('clientorganizationid') || "";
const user = localStorage.getItem('clientuser') || "{}";
const clientuser = JSON.parse(user);
const clientuserid = clientuser?.clientuserid;
const clientusername = clientuser?.name || '';

export const transactionsConfig: ModuleConfig = {
  keyField: 'Transaction',
  title: "Transactions",
  isImport: true,
  isExport: true,
  showTitle: true,
  addSearch: true,
  apiEndpoints: {
    list: {
      url: `${utils.baseUrl}/api/transactions/list`,
      payload: {
        clientorganizationid: clientorganizationid
      }
    },
    create: {
      url: `${utils.baseUrl}/api/transactions/create`,
      payload: {
        clientorganizationid: clientOrganizationId,
        createdbyuserid: clientuserid,
        modifiedbyuserid: clientuserid,
        clientuserid: clientuserid || "",
        clientusername: clientuser?.name || ""
      }
    },
    update: {
      url: `${utils.baseUrl}/api/transactions/update`,
      payload: {
        createdbyuserid: clientuserid,
        modifiedbyuserid: clientuserid,
        clientorganizationid: clientorganizationid,
        clientusername: clientusername
      }
    },
    delete: {
      url: `${utils.baseUrl}/api/transactions/delete`,
      payload: {
        clientorganizationid: clientOrganizationId
      }
    },
    total: {
      url: `${utils.baseUrl}/api/transactions/total`,
      payload: {
        clientorganizationid: clientorganizationid
      }
    }
  },
  fields: [
    { name: "name", type: "text", label: "Name", required: true, width: "200px" },
    { name: "amount", type: "number", label: "Amount", required: true, width: "100px", getCustomClass: (item) => item.amount > 10000 ? 'text-red-500' : '' },
    { name: "paidby", type: "text", label: "Paid By", required: true, width: "120px" },
    { name: "notes", type: "textarea", label: "Notes", width: "250px" }
  ]
};

import utils from "../../utils";
import { ModuleConfig } from "../harvests/types";

const clientorganizationid = localStorage.getItem('clientorganizationid') || "";
const clientOrganizationId = localStorage.getItem('clientorganizationid') || "";
const user = localStorage.getItem('clientuser') || "{}";
// const projectid = localStorage.getItem('projectid') || "";
const projectid = window.location.pathname.split('/').pop() || "";
const clientuser = JSON.parse(user);
const clientuserid = clientuser?.clientuserid;

export const expensesConfig: ModuleConfig = {
  keyField: 'Expense',
  title: "Expenses",
  showTotal: true,
  isImport: true,
  isExport: true,
  showTitle: false,
  apiEndpoints: {
    list: {
      url: `${utils.baseUrl}/api/expenses/list`,
      payload: {
        clientorganizationid: clientorganizationid
      }
    },
    create: {
      url: `${utils.baseUrl}/api/expenses/create`,
      payload: {
        clientorganizationid: clientOrganizationId,
        createdbyuserid: clientuserid,
        modifiedbyuserid: clientuserid,
        clientuserid: clientuserid || "",
        clientusername: clientuser?.name || "",
        projectid: projectid
      }
    },
    update: {
      url: `${utils.baseUrl}/api/expenses/update`,
      payload: {
        createdbyuserid: clientuserid,
        modifiedbyuserid: clientuserid,
        clientorganizationid: clientorganizationid,
        projectid: projectid
      }
    },
    delete: {
      url: `${utils.baseUrl}/api/expenses/delete`,
    },
  },
  fields: [
    { name: "name", type: "text", label: "Name", required: true, width: "150px" },
    { name: "amount", type: "number", label: "Amount", required: true, width: "100px" },
    { name: "clientusername", type: "text", label: "Paid By", form: false, width: "120px" },
    { name: "status", type: "select", label: "Status", options: ["pending", "paid"], required: true, width: "100px" },
    { name: "notes", type: "textarea", label: "Notes", width: "200px" },
    { name: "createdon", type: "text", label: "Created On", form: false, width: "150px" },
    { name: "modifiedon", type: "text", label: "Modified On", form: false, width: "150px" },
    { name: "createdbyusername", type: "text", label: "Created By", form: false, width: "120px" },
    { name: "modifiedbyusername", type: "text", label: "Modified By", form: false, width: "120px" },
  ],
};

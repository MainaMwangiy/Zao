import utils from "../../utils";
import { ModuleConfig } from "../harvests/types";

const user = localStorage.getItem('clientuser') || "{}";
const clientuser = JSON.parse(user);
const clientuserid = clientuser?.clientuserid;
const clientusername = clientuser?.name || '';

export const projectsConfig: ModuleConfig = {
  keyField: 'Project',
  title: "Projects",
  isImport: true,
  isExport: true,
  showTitle: true,
  addSearch: true,
  apiEndpoints: {
    create: {
      url: `${utils.baseUrl}/api/projects/create`,
      payload: {
        createdbyuserid: clientuserid,
        modifiedbyuserid: clientuserid,
        clientuserid: clientuserid || "",
        clientusername: clientuser?.name || ""
      }
    },
    update: {
      url: `${utils.baseUrl}/api/projects/update`,
      payload: {
        createdbyuserid: clientuserid,
        modifiedbyuserid: clientuserid,
        clientusername: clientusername
      }
    },
    delete: {
      url: `${utils.baseUrl}/api/projects/delete`
    }
  },
  fields: [
    { name: "projectname", type: "text", label: "Name", required: true },
    { name: "location", type: "text", label: "Location", required: true },
    { name: "size", type: "text", label: "Size", required: true },
    { name: "projectstatus", type: "select", label: "Status", options: ["ongoing", "completed"], required: true },
    { name: "costprojectestimation", type: "text", label: "Project Cost Estimation in Shillings", required: true },
    { name: "projectplan", type: "select", label: "Project Plan", options: ["Yes", "No"], required: true },
    // { name: "image", type: "image", label: "image", required: true },
  ]
};

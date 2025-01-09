export interface Colors {
  pending: string;
  paid: string;
}

export interface FieldConfig {
  name: string;
  type: "text" | "number" | "select" | "textarea" | "string" | "password";
  label: string;
  options?: string[];
  required?: boolean;
  width?: string;
  colors?: Colors;
  render?: (value: any, item?: any) => JSX.Element | string;
  onEvent?: (item: any) => void;
  getCustomClass?: (item: any) => string;
  form?: boolean;
  roleid?: number;
  convertValue?: (value: any) => string;
  passKeyField?: boolean;
  hide?: boolean;
  isRole?: boolean;
  isSuperAdmin?: boolean;
}

export interface ApiEndpointConfig {
  url: string;
  payload?: Record<string, any>;
  hideProject?: boolean;
}

export interface ModuleConfig {
  keyField: string;
  title: string;
  apiEndpoints: {
    list: ApiEndpointConfig;
    create: ApiEndpointConfig;
    update: ApiEndpointConfig;
    delete: ApiEndpointConfig;
    total?: ApiEndpointConfig;
  };
  fields: FieldConfig[];
  showTotal?: boolean;
  isImport: boolean;
  isExport: boolean;
  showTitle: boolean;
  hideActionMenu?: boolean;
  customKeyField?:string;
  skipKeyField?:boolean;
}

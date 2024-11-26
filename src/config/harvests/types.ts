export interface Colors {
  pending: string;
  paid: string;
}

export interface FieldConfig {
  name: string;
  type: 'text' | 'number' | 'select' | 'textarea' | 'string' | 'password' | 'date';
  label: string;
  options?: string[];
  required?: boolean;
  width?: string;
  colors?: Colors;
  form?: boolean;
  render?: (value: any, item?: any) => JSX.Element | string;
  onEvent?: (item: any) => void;
  getCustomClass?: (item: any) => string;
  convertValue?: (value: any) => string;
  passKeyField?: boolean;
  hide?: boolean;
  isRole?: boolean;
}

export interface ApiEndpointConfig {
  url: string;
  payload?: Record<string, any>;
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
  addSearch?: boolean;
}

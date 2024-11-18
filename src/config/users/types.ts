export interface ExpensesProps {
  expensesid: string;
  name: string;
  amount: string;
  status: string;
  notes: string;
  paidby: string;
  clientusername: string;
  createdon: string;
  key: string;
  clientuserid: string;
  createdbyusername: string;
  modifiedbyusername: string;
  modifiedon: string;
  expesesid: string;
  clientorganizationid: string;
  onEdit: () => void;
  onDelete: () => void;
}

export interface ExpenseProps {
  name: string;
  amount: string;
  status: string;
  notes: string;
  expensesid: string;
  clientuserid: string;
  clientusername: string;
  expesesid: string;
  clientorganizationid: string;
}
export interface AddExpenseModalProps {
  showExpenseModal: boolean;
  setExpenseShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  expense?: ExpenseProps | null;
  projectid?: string | number;
}

export interface ExpenseRowProps {
  expensesid: string;
  name: string;
  amount: string;
  status: string;
  notes: string;
  paidby: string;
  createdon: string;
  modifiedon: string;
  createdbyusername: string;
  modifiedbyusername: string;
  onEdit: () => void;
  onDelete: () => void;
}
export interface Colors {
  pending: string;
  paid: string;
}

export interface FieldConfig {
  name: string;
  type: 'text' | 'number' | 'select' | 'textarea' | 'string' | 'password';
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
}

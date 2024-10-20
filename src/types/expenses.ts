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

  export  interface ExpenseProps {
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
  export  interface AddExpenseModalProps {
    showExpenseModal: boolean;
    setExpenseShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    expense?: ExpenseProps | null;
    projectid?: string | number;
}

export  interface ExpenseRowProps {
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

export interface AddTransactionModalProps {
    showTransactionModal: boolean;
    setTransactionShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface User {
    clientuserid?: number;
    name?: string;
    email?: string;
    clientorganizationid?: string;
}

export interface TransactionRowProps {
    name: string;
    amount: string;
    notes: string;
    paidby: string;
}

export interface TransactionProps {
    name: string;
    amount: string;
    notes: string;
    clientusername: string;
}

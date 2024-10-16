export interface User {
    clientuserid: number;
    name: string;
    email: string;
    amount: number | string;
}

export interface Transaction {
    transactionid: number;
    amount: number | string;
    clientuserid: number;
    notes: string;
    createdon: string;
    modifiedon: string;
    isdeleted: number;
    name: string;
    recipientuserid: number;
}
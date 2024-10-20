
export interface ProjectProps {
    name: string;
    location: string;
    size: string;
    status: string;
    projectplan: string;
    clientorganizationid: string;
    costProjectEstimation: string;
}

export interface DataItem {
    name: string;
    amount: number;
    createdon: string;
    clientusername: string;
}
export interface HarvestDataItem {
    bags: string;
    createdon: string;
    clientusername: string;
    amountsold: string;
}

export type ImageUploadResponse = {
    url: {
        url: string;
    };
};

export interface SummaryProps {
    projectData: {
        title: string;
        addedBy: string;
        location: string;
        size: string;
        status: string;
        projectPlanIncluded: boolean;
        costProjectEstimation: string;
        imagesurl: string;
    };
}
export interface ExpensesProjectProps {
    projectData?: {
        title: string;
        addedBy: string;
        location: string;
        size: string;
        status: string;
        projectPlanIncluded: boolean;
        costProjectEstimation: string;
        id: string;
    };
    isProject?: boolean;  
}

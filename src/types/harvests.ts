export interface HarvestProps {
    harvestid: string;
    bags: number | string;
    unitprice: number | string;
    amountsold: number | string;
    notes: string;
    createdbyusername?: string;
    modifiedbyusername?: string;
    createdon?: string;
    modifiedon?: string;
    createdbyuserid?: string;
    modifiedbyuserid?: string;
    clientorganizationid?: string;
    projectid?: string | number | undefined;
}

export interface HarvestRowProps {
    harvest: {
        harvestid: string;
        bags: number | string;
        unitprice: number | string;
        amountsold: number | string;
        notes: string;
        createdbyusername?: string;
        modifiedbyusername?: string;
        createdon?: string;
        modifiedon?: string;
    };
    onEdit: () => void;
    onDelete: () => void;
}

export interface AddHarvestModalProps {
    showHarvestModal: boolean;
    setHarvestShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    harvest?: HarvestProps | null;
    projectid?: string | number;
}

export interface HarvestsProjectProps {
    projectData?: {
        title: string;
        addedBy: string;
        location: string;
        size: string;
        status: string;
        projectPlanIncluded: boolean;
        costprojectestimation: string;
        id: string;
        projectid?: string | number;
    };
    isProject?: boolean;
    projectid?: string | number;
}

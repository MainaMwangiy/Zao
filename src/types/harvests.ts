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
}

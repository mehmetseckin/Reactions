import * as React from "react";
import { Link } from "@fluentui/react";
import { IReaction, IReactionOwner } from "./Reactions";

export const OwnerSummary = (props: { reaction: IReaction, disabled: boolean, onClick: () => void }) => {
    
    let {reaction, disabled, onClick} = props;
    return (
        <div>
            <Link disabled={disabled} onClick={onClick}>
                {getTooltipText(reaction)}
            </Link>
        </div>
    );
}

const getTooltipText = (reaction: IReaction) => {

    var ownerNames = reaction.owners.map((o: IReactionOwner) => o.name || "(no name)");
    if(ownerNames.length < 3) {
        return ownerNames.join(" and ");
    }
    else {
        var othersCount = ownerNames.length - 2;
        return ownerNames.slice(0, 2).join(", ")
            + ` and ${othersCount} other${othersCount > 1 ? "s" : ""}`;
    }
}
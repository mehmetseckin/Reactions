import * as React from "react";
import { Callout, DirectionalHint } from "@fluentui/react";
import { ReactionButton } from "./ReactionButton";
import { IReaction } from ".";

interface IReactionsMenuProps {
    target: any;
    reactions: IReaction[];
    selecting: boolean;
    onSelect: (reaction: IReaction) => void;
}

export const ReactionsMenu = (props: IReactionsMenuProps) => (
    
    <Callout
        isBeakVisible={false}
        gapSpace={10}
        target={props.target}
        directionalHint={DirectionalHint.bottomAutoEdge}
        hidden={!props.selecting}
    >
        {props.reactions.map((reaction, index) => (
            <ReactionButton
                reaction={reaction}
                onClick={(reaction) => props.onSelect(reaction)}
                key={`reaction-${index}`}
            />
        ))}
    </Callout>
)
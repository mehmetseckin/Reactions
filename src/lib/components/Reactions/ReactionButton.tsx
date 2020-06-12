import * as React from "react";
import { DefaultButton, TooltipHost, DirectionalHint } from "@fluentui/react";
import { useId } from '@uifabric/react-hooks';
import { IReaction } from "./Reactions";
import { useState } from "react";
import { OwnerSummary } from "./OwnerSummary";
import { OwnersModal } from "./OwnersModal";

interface IReactionButtonProps {
    reaction: IReaction;
    onClick: (reaction: IReaction) => void;
    style?: React.CSSProperties;
    disabled?: boolean;
    showOwnersList?: boolean;
}

const styles: any = {
    reaction: {
        border: "none",
        minWidth: "32px", 
        paddingLeft: "4px", 
        paddingRight: "4px",
        backgroundColor: "rgba(255, 255, 255, 1)",
    }
}

const getReactionButtonText = (reaction: IReaction) => `${reaction.emoji}${ reaction.owners.length > 0 ? ` ${reaction.owners.length}` : `` }`
export const ReactionButton = (props: IReactionButtonProps) => {
    var tooltipId = useId('tooltip');
    let [isOwnersModalOpen, setOwnersModalOpen] = useState(false);
    let { reaction, showOwnersList, disabled, style } = props;
    return (
        <span>
            <TooltipHost
                content={
                    <OwnerSummary 
                        reaction={reaction} 
                        disabled={isOwnersModalOpen} 
                        onClick={() => setOwnersModalOpen(true)} 
                    />
                }
                id={tooltipId}
                calloutProps={{
                    hidden: !showOwnersList,
                    isBeakVisible: false,
                    gapSpace: 10,
                    directionalHint: DirectionalHint.bottomAutoEdge,
                    setInitialFocus: true
                }}
            >
            <DefaultButton
                disabled={disabled}
                text={getReactionButtonText(reaction)}
                styles={{ 
                        root: {
                            ...styles.reaction, 
                            ...style
                        }
                    }
                }
                onClick={() => props.onClick(props.reaction)}
            />
            </TooltipHost>
            <OwnersModal reaction={reaction}
                isOpen={isOwnersModalOpen}
                onDismiss={() => setOwnersModalOpen(false)}
            />
        </span>
    )
}

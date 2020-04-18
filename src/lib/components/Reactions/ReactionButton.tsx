import * as React from "react";
import { DefaultButton, TooltipHost, DirectionalHint, Link, Stack, Persona, Modal, IconButton } from "@fluentui/react";
import { useId } from '@uifabric/react-hooks';
import { IReaction, IReactionOwner } from "./Reactions";
import { useState } from "react";

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
    }
}

const getTooltipText = (reaction: IReaction) => {

    var ownerNames = reaction.owners.map((o: IReactionOwner) => o.name);
    if(ownerNames.length < 3) {
        return ownerNames.join(" and ");
    }
    else {
        var othersCount = ownerNames.length - 2;
        return ownerNames.slice(0, 2).join(", ")
            + ` and ${othersCount} other${othersCount > 1 ? "s" : ""}`;
    }
}

const OwnerSummary = (props: { reaction: IReaction, disabled: boolean, onClick: () => void }) => {
    
    let {reaction, disabled, onClick} = props;
    return (
        <div>
            <Link disabled={disabled} onClick={onClick}>
                {getTooltipText(reaction)}
            </Link>
        </div>
    );
}

const OwnersModal = (props: { reaction: IReaction, isOpen: boolean, onDismiss: () => void }) => (
    
    <Modal isOpen={props.isOpen}>
        <IconButton
            iconProps={{iconName: "ChromeClose"}}
            onClick={() => props.onDismiss()}
            styles={{
                root: {
                    marginLeft: 'auto',
                    marginTop: '4px',
                    marginRight: '2px',
                  }
            }}
        />
        <p>The following people have reacted to this with {props.reaction.emoji}:</p>
        <Stack>
            {props.reaction.owners.map(owner => (
                <Stack.Item>
                    <Link href={owner.profileUrl}>
                        <Persona
                            text={owner.name}
                            secondaryText={owner.title}
                            {...owner}
                        />
                    </Link>
                </Stack.Item>
            ))}
        </Stack>
    </Modal>
)

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
import * as React from "react";
import { DefaultButton, TooltipHost, DirectionalHint, Link, Stack, Persona, Modal, IconButton, FontWeights, mergeStyleSets, getTheme } from "@fluentui/react";
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
        backgroundColor: "rgba(255, 255, 255, 1)",
    }
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
    
    <Modal 
        isOpen={props.isOpen}
        containerClassName={contentStyles.container}
    >
        <div className={contentStyles.header}>
            <span>{props.reaction.emoji} Reactions</span>
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
        </div>
        <div className={contentStyles.body}>
            <p>The following people have reacted to this with {props.reaction.emoji}:</p>
            <Stack>
                {props.reaction.owners.map(owner => (
                    <Stack.Item>
                        <Link href={owner.profileUrl}>
                            <Persona
                                text={owner.name || "(no name)"}
                                secondaryText={owner.title}
                                {...owner}
                            />
                        </Link>
                    </Stack.Item>
                ))}
            </Stack>
        </div>
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

const theme = getTheme();
const contentStyles = mergeStyleSets({
  container: {
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'stretch',
  },
  header: [
    // tslint:disable-next-line:deprecation
    theme.fonts.xLargePlus,
    {
      flex: '1 1 auto',
      borderTop: `4px solid ${theme.palette.themePrimary}`,
      color: theme.palette.neutralPrimary,
      display: 'flex',
      alignItems: 'center',
      fontWeight: FontWeights.semibold,
      padding: '12px 12px 14px 24px',
    },
  ],
  body: {
    flex: '4 4 auto',
    padding: '0 24px 24px 24px',
    overflowY: 'hidden',
    selectors: {
      p: { margin: '14px 0' },
      'p:first-child': { marginTop: 0 },
      'p:last-child': { marginBottom: 0 },
    },
  },
});

const iconButtonStyles = {
    root: {
      color: theme.palette.neutralPrimary,
      marginLeft: 'auto',
      marginTop: '4px',
      marginRight: '2px',
    },
    rootHovered: {
      color: theme.palette.neutralDark,
    },
  };
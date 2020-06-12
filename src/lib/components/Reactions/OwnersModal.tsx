import * as React from "react";
import { Link, Stack, Persona, Modal, IconButton, FontWeights, mergeStyleSets, getTheme } from "@fluentui/react";
import { IReaction } from "./Reactions";

export const OwnersModal = (props: { reaction: IReaction, isOpen: boolean, onDismiss: () => void }) => (
    
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
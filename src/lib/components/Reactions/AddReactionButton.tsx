import * as React from "react";
import { DefaultButton, IIconProps } from "@fluentui/react";

const addReactionIcon: IIconProps = { iconName: 'AddReaction' }

const styles = {
    addReaction: {
        color: "rgba(0, 0, 0, 0.9)",
        minWidth: "32px", 
        paddingLeft: "4px", 
        paddingRight: "4px",
        border: "1px solid #ccc",
        margin: "0 2px"
    }
}

interface IAddReactionButtonProps {
    disabled: boolean;
    checked: boolean;
    onClick: () => void;
}

export const AddReactionButton = (props: IAddReactionButtonProps) => (
    <DefaultButton
        styles={{
            root: {
                ...styles.addReaction
            }
        }}
        iconProps={addReactionIcon}
        disabled={props.disabled}
        checked={props.checked}
        onClick={props.onClick}
    />
)
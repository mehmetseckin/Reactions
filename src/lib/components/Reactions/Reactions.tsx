import * as React from "react";
import { AddReactionButton } from "./AddReactionButton"
import { ReactionsMenu } from "./ReactionsMenu"
import { ReactionButton } from "./ReactionButton";
import { Stack, IPersona, PersonaPresence } from "@fluentui/react";

export interface IReactionsProps {
    disabled: boolean;
    availableReactions: string[];
    reactions: IReaction[];
    owner: IReactionOwner;
    onChange: (eventType: "ms.reaction.add" | "ms.reaction.remove", reaction: IReaction, newReactions: IReaction[]) => void;
}

interface IReactionsState {
    selecting: boolean;
}

export interface IReaction {
    emoji: string;
    owners: IReactionOwner[];
}

export interface IReactionOwner extends IPersona {
    id: string;
    name: string;
    title?: string;
    primaryText?: string;
    secondaryText?: string;
    tertiaryText?: string;
    presence?: PersonaPresence;
    imageUrl?: string;
    profileUrl?: string;
}

export class Reactions extends React.Component<IReactionsProps, IReactionsState>
{
    private _addReactionButtonElement: HTMLDivElement | null = null;

    constructor(props: IReactionsProps) {
        super(props);
        this.state = {
            selecting: false
        };
    }

    onAddReactionClick = () => {
        this.setState({
            selecting: !this.state.selecting
        });
    }

    onSelect = (reaction: IReaction) => {
        let { reactions, owner, onChange } = this.props;

        let existingReaction = reactions.filter(r => r.emoji === reaction.emoji)[0];
        if(existingReaction) {
            if(existingReaction.owners.some(o => o.id === owner.id)) {
                existingReaction.owners = [...existingReaction.owners.filter(o => o.id !== owner.id)];

                if(existingReaction.owners.length === 0) {
                    reactions = [...reactions.filter(r => r.emoji !== reaction.emoji)];
                }

                onChange("ms.reaction.remove", existingReaction, reactions);
            }
            else {
                existingReaction.owners.push(owner);
                onChange("ms.reaction.add", existingReaction, reactions);
            }
        } 
        else {
            var newReaction = {
                emoji: reaction.emoji,
                owners: [owner]
            };
            reactions.push(newReaction);
            onChange("ms.reaction.add", newReaction, reactions);
        }
    }
    
    render() {

        let { disabled, availableReactions, reactions } = this.props;
        let { selecting } = this.state;
        return (
            <div>
                <Stack horizontal disableShrink>
                    {reactions
                    .sort((a, b) => availableReactions.indexOf(a.emoji) > availableReactions.indexOf(b.emoji) ? 1 : -1)
                    .filter(r => r.owners.length > 0)
                    .map((reaction, index) => (
                        <Stack.Item>
                            <ReactionButton
                                disabled={disabled}
                                showOwnersList={true}
                                reaction={reaction}
                                key={`reaction-${index}`}
                                onClick={() => this.onSelect(reaction)}
                                style={{
                                    border: "1px solid #ccc",
                                    margin: "0px 2px"
                                }}
                            />
                        </Stack.Item>
                    ))}
                    <Stack.Item>
                        <div ref={addReactionButton => this._addReactionButtonElement = addReactionButton}>
                            <AddReactionButton
                                disabled={disabled}
                                checked={selecting}
                                onClick={this.onAddReactionClick}
                            />
                        </div>
                    </Stack.Item>
                </Stack>
                <ReactionsMenu
                    reactions={availableReactions.map(r => ({ emoji:r, owners: [] }))}
                    selecting={selecting}
                    target={this._addReactionButtonElement}
                    onSelect={(reaction) => {
                        this.onSelect(reactions.filter(r => r.emoji === reaction.emoji)[0] || reaction);
                        this.setState({ selecting: !selecting });
                    }}
                />
            </div>
        )
    }
}
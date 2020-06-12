import {IInputs, IOutputs} from "./generated/ManifestTypes";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Reactions, IReactionsProps, IReaction } from "../lib";
import { initializeIcons } from "@fluentui/react";

initializeIcons();

export class Field implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	private _container: HTMLDivElement;
	private _reactions: IReaction[];
	private _notifyOutputChanged: () => void;

	/**
	 * Empty constructor.
	 */
	constructor()
	{

	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement)
	{
		this._container = container;
		this._reactions = this.getReactions(context)
		this._notifyOutputChanged = notifyOutputChanged;
	}


	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
		ReactDOM.render(
			React.createElement(Reactions, this.getReactionsProps(context)),
			this._container
		);
	}

	private getReactionsProps(context: ComponentFramework.Context<IInputs>) : IReactionsProps {
	
		return {
			reactions: this.getReactions(context),
			disabled: context.mode.isControlDisabled,
			owner: {
				id: context.userSettings.userId,
				name: context.userSettings.userName // TODO: get full name, title, imageUrl etc
			},
			availableReactions: (context.parameters.availableReactions.raw || "").split(",").map(symbol => symbol.trim()),
			onChange: (eventType: string, reaction: IReaction, newReactions: IReaction[]) => {
				this._reactions = newReactions;
				this._notifyOutputChanged();
			}
		};
	}

	private getReactions(context: ComponentFramework.Context<IInputs>): IReaction[] {
		try {
			return JSON.parse(context.parameters.reactions.raw || "[]")
		}
		catch {
			return [];
		}
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs
	{
		return {
			reactions: JSON.stringify(this._reactions)
		};
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void
	{
		// Add code to cleanup control if necessary
	}
}
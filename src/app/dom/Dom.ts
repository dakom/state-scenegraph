import {propsAtChildLensPath, InputSender} from "../../lib/Drift";
import * as L from "partial.lenses";
import { initialState } from '../state/State';

const BUTTONS:Array<[string, any]> = [
    ["red", L.compose([propsAtChildLensPath([1,0,0]), "interactive"])],
    ["aqua",  L.compose([propsAtChildLensPath([1,0,0,0]), "interactive"])],
    ["green",  L.compose([propsAtChildLensPath([1,0,0,1]), "interactive"])],
    ["blue",  L.compose([propsAtChildLensPath([1,0,0,1,0]), "interactive"])],
    ["yellow",  L.compose([propsAtChildLensPath([1,0,0,1,0,0]), "interactive"])],
]

export interface DomEventData {
    lens: any;
    interactive: boolean;
}
export const startDom = (send:InputSender) => {
    const uiElement = document.getElementById("ui");
    uiElement.setAttribute("style", "margin: 12px");

    const instructions = document.createElement("div");
    instructions.innerHTML = `
        Use arrow keys (keyboard)
        <br/>
        Or touch to drag
        <p/>
        Toggle interactivity:              
    `

    const togglesList = document.createElement("ul");
    togglesList.setAttribute("style", "list-style: none; margin: 8px; padding: 0");

    BUTTONS.forEach(([label, lens]) => {
        const eLi = document.createElement("li");
        const eLabel = document.createElement("span");
        eLabel.setAttribute("style", "margin-left: 8px; margin-bottom: 8px; cursor: pointer");
        eLabel.innerHTML = label;
        
        const eCheckbox = document.createElement("input");
        eCheckbox.type = "checkbox";
        eCheckbox.checked = L.get(L.compose(lens)) (initialState);

        eLi.appendChild(eCheckbox);
        eLi.appendChild(eLabel);
        togglesList.appendChild(eLi);

        const broadcastChange = () => {
            const evtData:DomEventData = {
                lens: lens,
                interactive: eCheckbox.checked
            }

            send({
                sourceId: "dom",
                data: evtData
            });
        }

        eLabel.addEventListener("click", evt => {
            eCheckbox.checked = !eCheckbox.checked;
            broadcastChange();
        });

        eCheckbox.addEventListener("change", broadcastChange);
    });

    uiElement.appendChild(instructions);
    uiElement.appendChild(togglesList);
}

import { useState } from "react";
import classNames from "classnames";
import "./menu.css";

/* pass variables/functions into component using Props */
type Props = {
    onAction(action: "reset" | "new-round"): void;
    dropDown: boolean;
    /* Alternatives: */
    // onReset(): void
    // onNewRound(): void
};
export default function Menu({ onAction, dropDown }: Props) {  /* Alternatives: { onReset, onNewRound }: Props */
    const [menuOpen, setMenuOpen] = useState(dropDown);

    return (
        <div className="menu" onClick={() =>
            setMenuOpen(state=> !state)}>
            <button className="menu-btn" >
                Actions
                {/* Render classNames using classNames utility from "classnames" */}
                <i className={classNames("fa-solid", menuOpen ? "fa-chevron-up": "fa-chevron-down")}></i>

                {/* Alternative:
                {
                    menuOpen ? <i className="fa-solid fa-chevron-up"></i>
                        : <i className="fa-solid fa-chevron-down"></i>
                }
                */}
                {/* Alternative 2: IF ELSE instead of ternary operation
                {
                    (() => {
                        if (menuOpen)
                            return (<i className="fa-solid fa-chevron-down"></i>)
                        else
                            return (<i className="fa-solid fa-chevron-up"></i>)
                    })()
                }
                */}
            </button>

            {menuOpen &&
                <div className="dropdown border">
                    <button onClick={() => { /* Alternatives: () => onReset */
                        onAction("reset")
                    }}>Reset</button>

                    <button onClick={() => { /* Alternatives: () => onNewRound */
                        onAction("new-round")
                    }}>New Round</button>
                </div>
            }
        </div>
    );
}
import "./modal.css";

type Props = {
    text: string
    reset(type: boolean): void
}
export default function Modal({text, reset}: Props) {
    return (
        <div className="overlay centered-column-flex">
            <div className="modal centered-column-flex">
                <p>{text}</p>
                <button onClick={() => reset(false)}>Play again
                </button>
            </div>
        </div>
    );
}
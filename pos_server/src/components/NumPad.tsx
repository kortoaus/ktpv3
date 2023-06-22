import React, { SyntheticEvent } from "react";

type Props = {
  val: string;
  setVal: (val: string) => void;
  useDot?: boolean;
};

export default function NumPad({ val, setVal, useDot = true }: Props) {
  const setValHandler = (e: SyntheticEvent, input: string) => {
    switch (input) {
      case "bs":
        setVal(val.slice(0, val.length - 1));
        break;

      case ".":
        setVal(val.replaceAll(".", "") + ".");
        break;
      default:
        setVal(val + input);
        break;
    }
    return;
  };

  return (
    <div className="NumPad">
      <button onClick={(e) => setValHandler(e, "1")}>1</button>
      <button onClick={(e) => setValHandler(e, "2")}>2</button>
      <button onClick={(e) => setValHandler(e, "3")}>3</button>
      <button onClick={(e) => setValHandler(e, "4")}>4</button>
      <button onClick={(e) => setValHandler(e, "5")}>5</button>
      <button onClick={(e) => setValHandler(e, "6")}>6</button>
      <button onClick={(e) => setValHandler(e, "7")}>7</button>
      <button onClick={(e) => setValHandler(e, "8")}>8</button>
      <button onClick={(e) => setValHandler(e, "9")}>9</button>
      <button onClick={(e) => setValHandler(e, "bs")}>BS</button>
      <button
        className={!useDot ? "col-span-2" : ""}
        onClick={(e) => setValHandler(e, "0")}
      >
        0
      </button>
      {useDot && <button onClick={(e) => setValHandler(e, ".")}>.</button>}
    </div>
  );
}

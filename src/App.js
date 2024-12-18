import { useState, useRef } from "react";
import "./styles.css";

const Grid = ({ pos, onClickRedBlock, row = 10, col = 10 }) => {
  return (
    <div className="Grid">
      <div className="blocks">
        {new Array(row).fill(null).map((r, i) => (
          <div key={"row-" + i} className="row-block">
            {new Array(col).fill(null).map((c, j) => (
              <div
                key={"col-" + i + "-" + j}
                className="block"
                style={{
                  backgroundColor:
                    pos[0] == i && pos[1] == j ? "red" : undefined,
                }}
                onClick={() => {
                  onClickRedBlock(i, j);
                }}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
const Table = ({ records }) => {
  return (
    <div className="Table">
      <table>
        <thead>
          <tr>
            <td>Mouse Click Number</td>
            <td>Reaction Time</td>
          </tr>
        </thead>
        <tbody>
          {records.map((record, i) => (
            <tr key={"table-row-" + i}>
              <td>{record.no}</td>
              <td>{record.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default function App() {
  const [reactionSec, setReactionSec] = useState(3);
  const [pos, setPos] = useState([null, null]);
  const [record, setRecord] = useState([]);
  const [start, setStart] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  //{no,time}
  const timer = useRef(null);

  const random = (row, col) => {
    const n = Math.floor(Math.random() * row * col);
    return [Math.floor(n / col), n % col];
  };
  const resetTimer = () => {
    if (timer.current) {
      clearInterval(timer.current);
    }
  };
  const startTimer = () => {
    setPos(random(10, 10));
    timer.current = setInterval(() => {
      setPos(random(10, 10));
    }, reactionSec * 1000);
    setIsPaused(false);
  };

  const handleStart = () => {
    if (!reactionSec) {
      alert("Enter reaction time");
      return;
    }
    if (reactionSec < 2 || reactionSec > 10) {
      alert("reaction Time should be between 2 and 10 sec");
      return;
    }
    if (!isPaused) setStart(Date.now());
    startTimer();
  };
  const handlePause = () => {
    debugger;
    resetTimer();
    setIsPaused(true);
    setPos([null, null]);
  };
  const handleReset = () => {
    setRecord([]);
    resetTimer();
    setPos([null, null]);
    setReactionSec("");
    setIsPaused(false);
  };
  const onClickRedBlock = () => {
    const now = Date.now();
    const diff = Number(((now - start) / 1000).toFixed(1));

    const reactionTime =
      record.length == 0 ? diff : record[record.length - 1].time + diff;
    const clickCount = record.length + 1;
    setRecord((prev) =>
      prev.concat({ no: clickCount, time: Number(reactionTime.toFixed(1)) })
    );
    setStart(now);
    resetTimer();
    startTimer();
  };
  return (
    <div className="App">
      <div>
        <button onClick={handleStart}>Start</button>
        <button onClick={handlePause} disabled={isPaused}>
          Pause{" "}
        </button>
        <button onClick={handleReset}>Reset </button>
        <input
          placeholder="Enter Reaction Time"
          value={reactionSec}
          onChange={(e) => setReactionSec(Number(e.target.value))}
        />
      </div>
      <Grid pos={pos} onClickRedBlock={onClickRedBlock} />
      <Table records={record} />
    </div>
  );
}

import "./App.css";

// Tile color codes
const colors = {
  0: "#DDDDDD",
  2: "#00E0BD",
  4: "#10BDB5",
  8: "#22AABF",
  16: "#2D8DB5",
  32: "#3770AB",
  64: "#4253A1",
  128: "#4C3597",
  256: "#522390",
  512: "#3E1271",
  1024: "#2A0052",
  2048: "#230D45",
  4096: "1A0A33",
  8192: "110722",
};

const Tile = (props) => {
  let val = props.val === 0 ? "" : props.val;

  return (
    <td>
      <div
        className="square m-1 p-2"
        style={{ backgroundColor: `${colors[props.val]}` }}
      >
        <div className="is-size-4 has-text-light">{val}</div>
      </div>
    </td>
  );
};

export default Tile;

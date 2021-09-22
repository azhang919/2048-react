import Tile from "./Tile.js";

const Row = (props) => {
  return (
    <tr>
      {props.row.map((tileVal, i) => (
        <Tile key={i} val={tileVal} />
      ))}
    </tr>
  );
};

export default Row;

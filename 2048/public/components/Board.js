import Row from "../Row.js";

const Board = (props) => {
  return (
    <tbody>
      {props.gameObj.getAllRows().map((r, i) => (
        <Row key={i} row={r} />
      ))}
    </tbody>
  );
};

export default Board;

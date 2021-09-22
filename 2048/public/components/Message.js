const Message = (props) => {
  if (props.lose) {
    return <p>Game over. Click the button to start a new game!</p>;
  } else if (props.win) {
    return <p>Congratulations, you won! Keep playing, or start a new game.</p>;
  } else {
    return <p></p>;
  }
};

export default Message;

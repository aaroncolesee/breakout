import React, { useState, useRef, useEffect } from "react";
import Styled from "styled-components";

const Styles = Styled.div`
`;

const createBall = () => {
  return {
    x: 30,
    y: 300,
    radius: 10,
    speed: 5,
    dx: 1,
    dy: 1,
    color: "#5d35ca",
  };
};

const createPaddle = () => {
  return {
    x: 100,
    y: 350,
    width: 100,
    height: 10,
    speed: 7,
    dx: 0,
    color: "#5d35ca",
  };
};

const createBricks = () => {
  const brick = {
    x: 10,
    y: 10,
    width: 50,
    height: 20,
    offX: 10,
    offY: 10,
    color: "#5d35ca",
    isVisible: true,
  };

  const bricks = [];
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 5; j++) {
      bricks.push({
        x: brick.x + (brick.width + brick.offX) * i,
        y: brick.y + (brick.height + brick.offY) * j,
        width: brick.width,
        height: brick.height,
        color: brick.color,
        isVisible: brick.isVisible,
      });
    }
  }
  return bricks;
};

function Game() {
  const canvasWidth = 610;
  const canvasHeight = 400;

  const canvasRef = useRef(null);

  const [isGame, setIsGame] = useState(false);
  const [isLose, setIsLose] = useState(false);
  const [score, setScore] = useState(0);
  const [ball, setBall] = useState(createBall);
  const [paddle, setPaddle] = useState(createPaddle);
  const [bricks, setBricks] = useState(createBricks);

  const isGameRef = useRef(isGame);
  isGameRef.current = isGame;
  const isLoseRef = useRef(isLose);
  isLoseRef.current = isLose;
  const scoreRef = useRef(score);
  scoreRef.current = score;
  const ballRef = useRef(ball);
  ballRef.current = ball;
  const paddleRef = useRef(paddle);
  paddleRef.current = paddle;
  const bricksRef = useRef(bricks);
  bricksRef.current = bricks;

  useEffect(() => {
    update();
  }, []);

  const drawBall = (ctx) => {
    ctx.beginPath();
    ctx.arc(
      ballRef.current.x,
      ballRef.current.y,
      ballRef.current.radius,
      0,
      2 * Math.PI
    );
    ctx.fillStyle = ballRef.current.color;
    ctx.fill();
    ctx.closePath();
  };

  const drawPaddle = (ctx) => {
    ctx.beginPath();
    ctx.rect(
      paddleRef.current.x,
      paddleRef.current.y,
      paddleRef.current.width,
      paddleRef.current.height
    );
    ctx.fillStyle = paddleRef.current.color;
    ctx.fill();
    ctx.closePath();
  };

  const drawBricks = (ctx) => {
    for (let brick of bricksRef.current) {
      if (brick.isVisible) {
        ctx.beginPath();
        ctx.rect(brick.x, brick.y, brick.width, brick.height);
        ctx.fillStyle = brick.color;
        ctx.fill();
        ctx.closePath();
      }
    }
  };

  const moveBall = () => {
    ballRef.current.x += ballRef.current.dx;
    ballRef.current.y += ballRef.current.dy;

    // wall collsions
    if (
      ballRef.current.x + ballRef.current.radius > canvasWidth ||
      ballRef.current.x - ballRef.current.radius < 0
    ) {
      ballRef.current.dx = -ballRef.current.dx;
    }
    if (ballRef.current.y - ballRef.current.radius < 0) {
      ballRef.current.dy = -ballRef.current.dy;
    }
    if (ballRef.current.y + ballRef.current.radius > canvasHeight) {
      setIsGame(false);
      setIsLose(true);
    }

    // paddle collision
    if (
      ballRef.current.y > paddleRef.current.y &&
      ballRef.current.x < paddleRef.current.x + paddleRef.current.width &&
      ballRef.current.x > paddleRef.current.x
    ) {
      ballRef.current.dy = -ballRef.current.speed;
    }

    // brick collision
    for (let brick of bricksRef.current) {
      if (brick.isVisible) {
        if (
          ballRef.current.x > brick.x && // left
          ballRef.current.x < brick.x + brick.width && // right
          ballRef.current.y - ballRef.current.radius < brick.y + brick.height && // down
          ballRef.current.y + ballRef.current.radius > brick.y // top
        ) {
          ballRef.current.dy = -ballRef.current.dy;
          brick.isVisible = false;
          setScore(scoreRef.current + 1);
        }
      }
    }
  };

  const movePaddle = () => {
    paddleRef.current.x += paddleRef.current.dx;

    // wall collsions
    if (paddleRef.current.x < 0) {
      paddleRef.current.x = 0;
    }
    if (paddleRef.current.x + paddleRef.current.width > canvasWidth) {
      paddleRef.current.x = canvasWidth - paddleRef.current.width;
    }
  };

  const update = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (isGameRef.current) {
      moveBall();
      movePaddle();
    }

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    drawBall(ctx);
    drawPaddle(ctx);
    drawBricks(ctx);

    requestAnimationFrame(update);
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowLeft") {
      paddleRef.current.dx = -paddleRef.current.speed;
    }
    if (event.key === "ArrowRight") {
      paddleRef.current.dx = paddleRef.current.speed;
    }
  };

  const handleKeyUp = (event) => {
    paddleRef.current.dx = 0;
  };

  const resetGame = () => {
    setIsGame(false);
    setIsLose(false);
    setScore(0);
    setBall(createBall());
    setPaddle(createPaddle());
    setBricks(createBricks());
  };

  return (
    <Styles
      style={{
        display: "grid",
        gridTemplateRows: "auto 1fr auto",
        backgroundColor: "#5d35ca",
      }}
    >
      <div className="title">Breakout {scoreRef.current}</div>
      <div>
        <canvas
          tabIndex="0"
          id="game-canvas"
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          style={{ border: "1px solid black", backgroundColor: "white" }}
          onClick={() => {
            if (!isGame && !isLose) {
              setIsGame(true);
            }
          }}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
        />
      </div>
      <button
        onClick={() => {
          resetGame();
        }}
      >
        new game
      </button>
    </Styles>
  );
}

export default Game;

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

  const [ball, setBall] = useState(createBall);
  const [paddle, setPaddle] = useState(createPaddle);
  const [bricks, setBricks] = useState(createBricks);
  const [score, setScore] = useState(0);

  useEffect(() => {
    update();
  }, []);

  const drawBall = (ctx) => {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
  };

  const drawPaddle = (ctx) => {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillStyle = paddle.color;
    ctx.fill();
    ctx.closePath();
  };

  const drawBricks = (ctx) => {
    for (let brick of bricks) {
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
    ball.x += ball.dx;
    ball.y += ball.dy;

    // wall collsions
    if (ball.x + ball.radius > canvasWidth || ball.x - ball.radius < 0) {
      ball.dx = -ball.dx;
    }
    if (ball.y + ball.radius > canvasHeight || ball.y - ball.radius < 0) {
      ball.dy = -ball.dy;
    }

    // paddle collision
    if (
      ball.y + ball.radius > paddle.y &&
      ball.x + ball.radius < paddle.x + paddle.width &&
      ball.x - ball.radius > paddle.x
    ) {
      ball.dy = -ball.speed;
    }

    // brick collision
    for (let brick of bricks) {
      if (brick.isVisible) {
        if (
          ball.x - ball.radius > brick.x && // left
          ball.x + ball.radius < brick.x + brick.width && // right
          ball.y - ball.radius < brick.y + brick.height && // down
          ball.y + ball.radius > brick.y // top
        ) {
          ball.dy = -ball.dy;
          brick.isVisible = false;
          //setScore(score + 1);
        }
      }
    }
  };

  const movePaddle = () => {
    paddle.x += paddle.dx;

    // wall collsions
    if (paddle.x < 0) {
      paddle.x = 0;
    }
    if (paddle.x + paddle.width > canvasWidth) {
      paddle.x = canvasWidth - paddle.width;
    }
  };

  const update = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    moveBall();
    movePaddle();

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    drawBall(ctx);
    drawPaddle(ctx);
    drawBricks(ctx);

    requestAnimationFrame(update);
  };

  const handleKeyPress = (event) => {
    if (event.key === "ArrowLeft") {
      paddle.dx = -paddle.speed;
    }
    if (event.key === "ArrowRight") {
      paddle.dx = paddle.speed;
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowLeft") {
      paddle.dx = -paddle.speed;
    }
    if (event.key === "ArrowRight") {
      paddle.dx = paddle.speed;
    }
  };

  const handleKeyUp = (event) => {
    paddle.dx = 0;
  };

  //keyup

  return (
    <Styles>
      <div className="title">Breakout {score}</div>
      <div>
        <canvas
          tabIndex="0"
          id="game-canvas"
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          style={{ border: "1px solid black" }}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
        />
      </div>
    </Styles>
  );
}

export default Game;

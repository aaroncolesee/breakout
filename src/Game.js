import React, { useState, useRef, useEffect } from "react";
import Styled from "styled-components";

const Styles = Styled.div`
`;

function Game() {
  const canvasWidth = 610;
  const canvasHeight = 400;
  const moveSpeed = 10;

  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    update(ctx);
    document.addEventListener("keydown", (event) => {
      handleKeyPress(event);

      ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
      update(ctx);
    });
  }, []);

  const ball = { x: 30, y: 300, radius: 15, dx: 0, dy: 0, color: "#5d35ca" };

  const paddle = { x: 100, y: 350, width: 100, height: 20, color: "#5d35ca" };

  const brickObj = {
    x: 10,
    y: 10,
    width: 50,
    height: 20,
    offX: 10,
    offY: 10,
    color: "#5d35ca",
  };

  const bricks = [];
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 5; j++) {
      bricks.push({
        x: brickObj.x + (brickObj.width + brickObj.offX) * i,
        y: brickObj.y + (brickObj.height + brickObj.offY) * j,
        width: brickObj.width,
        height: brickObj.height,
        color: brickObj.color,
      });
    }
  }

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
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.width, brick.height);
      ctx.fillStyle = brick.color;
      ctx.fill();
      ctx.closePath();
    }
  };

  const update = (ctx) => {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawBall(ctx);
    drawPaddle(ctx);
    drawBricks(ctx);
  };

  const handleKeyPress = (event) => {
    if (event.key === "ArrowLeft") {
      if (paddle.x - moveSpeed >= 0) {
        paddle.x -= moveSpeed;
      }
    }
    if (event.key === "ArrowRight") {
      if (paddle.x + paddle.width + moveSpeed <= canvasWidth) {
        paddle.x += moveSpeed;
      }
    }
  };

  return (
    <Styles>
      <div className="title">Breakout</div>
      <div>
        <canvas
          id="game-canvas"
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          style={{ border: "1px solid black" }}
        />
      </div>
    </Styles>
  );
}

export default Game;

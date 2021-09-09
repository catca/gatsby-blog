import React, { useState, useRef, useEffect } from "react";
import styled from '@emotion/styled';

interface WaterProps {
    radius: number;
    x: number;
    y: number;
    dx: number;
    dy: number;
    friction: number;
    update: () => void;
    draw: () => void;
}

interface ParticleProps {
    x: number;
    y: number;
    size: {
        width: number;
        height: number;
    }
    dx: number;
    dy: number;
    gravity: number;
    friction: number;
    timeToLive: number;
    opacity: number;
    update: () => void;
    draw: () => void;
    isAlive: () => boolean;
}

const Canvas = styled.canvas`
  position: fixed;
  z-index: -1;
  width: 100%;
  height: 100%;
`;

const Rain = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [startEffect, setStartEffect] = useState(false)
    const [start, setStart] = useState(false)
    let canvas: any = canvasRef.current;
    let ctx: any;
    let groundHeight: number;
    let backgroundGradient: { addColorStop: (arg0: number, arg1: string) => void; };

    useEffect(() => {
        canvas = canvasRef.current;
        setStartEffect(true);
    }, [canvas])

    useEffect(() => {
        ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        groundHeight = canvas.height * 0.15;
        backgroundGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        backgroundGradient.addColorStop(0, "#171e26");
        backgroundGradient.addColorStop(1, "#3f586b");
        setStart(true);
        animation();
    }, [startEffect])

    function Water(this: WaterProps) {
        if (!start) return;
        this.radius = Math.random() + 1;
        this.x = this.radius + (canvas.width - this.radius * 2) * Math.random();
        this.y = -10;
        this.dx = Math.random() * 5;
        this.dy = 30;
        this.friction = .54;

        this.update = function () {

            // // Move particles by velocity
            if (this.y - this.radius + this.dy * Math.random() / 2 >= canvas.height - groundHeight) {
                explosions.push(new Explosion(this));
                this.radius = 0;
            } else {
                this.x += this.dx;
                this.y += this.dy;
            }

            this.draw();

            // Draw particles from explosion
            for (var i = 0; i < explosions.length; i++) {
                explosions[i].update();
            }

        }
        this.draw = function () {
            ctx.beginPath();
            ctx.arc(this.x, this.y, Math.abs(this.radius), 0, Math.PI * 2, false);

            ctx.shadowColor = '#E3EAEF';
            ctx.shadowBlur = 20;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;

            ctx.fillStyle = "#E3EAEF";
            ctx.fill();
            ctx.closePath();
        }
    }

    function Particle(this: ParticleProps, x: number, y: number, dx: number, dy: number): void {
        if (!start) return;
        this.x = x;
        this.y = y;
        this.size = {
            width: 2,
            height: 2
        };
        this.dx = dx;
        this.dy = dy;
        this.gravity = .09;
        this.friction = 0.88;
        this.timeToLive = 3;
        this.opacity = 1;

        this.update = function () {
            if (this.y + this.size.height + this.dy >= canvas.height - groundHeight) {
                this.dy = -this.dy * this.friction;
                this.dx *= this.friction;
            } else {
                this.dy += this.gravity;
            }

            if (this.x + this.size.width + this.dx >= canvas.width || this.x + this.dx < 0) {
                this.dx = -this.dx;
                this.dx *= this.friction;
            };
            this.x += this.dx;
            this.y += this.dy;

            this.draw();

            this.timeToLive -= 0.01;
            this.opacity -= 1 / (this.timeToLive / 0.02);
        }
        this.draw = function () {
            ctx.fillStyle = "rgba(227, 234, 239," + this.opacity + ")";
            ctx.shadowColor = '#E3EAEF';
            ctx.shadowBlur = 20;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.fillRect(this.x, this.y, this.size.width, this.size.height);
        }

        this.isAlive = function () {
            return 0 <= this.timeToLive;
        }
    }

    function Explosion(this: any, Water: any): void {
        if (!start) return;
        this.particles = [];

        this.init = function (parentStar: { x: number; y: number; }) {
            for (let i = 0; i < 8; i++) {
                var velocity = {
                    x: (Math.random() - 0.5) * 5,
                    y: (Math.random() - 0.1) * 7,
                }
                this.particles.push(new Particle(parentStar.x, parentStar.y, velocity.x, velocity.y));
            }
        }

        this.init(Water);

        this.update = function () {
            for (let i = 0; i < this.particles.length; i++) {
                this.particles[i].update();
                if (this.particles[i].isAlive() == false) {
                    this.particles.splice(i, 1);
                }
            }
        }
    }

    let timer = 0;
    let stars: any[] = [];
    let explosions: any[] = [];

    let randomSpawnRate = Math.floor((Math.random() * 25) + 60)

    function animation() {
        if (!start) return;
        window.requestAnimationFrame(animation);
        ctx.fillStyle = backgroundGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#182028";
        ctx.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);



        for (var i = 0; i < stars.length; i++) {
            stars[i].update();
            // console.log(stars[0].isAlive());

            if (stars[i].radius <= 0) {
                stars.splice(i, 1);
            }
        }

        for (var i = 0; i < explosions.length; i++) {
            if (explosions[i].particles.length <= 0) {
                explosions.splice(i, 1);
            }
        }

        timer++;
        if (timer % randomSpawnRate == 0) {
            stars.push(new Water());
            randomSpawnRate = Math.floor((Math.random() * 6) + 6)
        }

    }
    return (
        <Canvas ref={canvasRef} />
    )
}

export default Rain;
import React, { useState, useRef, useEffect } from "react";
import styled from "@emotion/styled"

const Canvas = styled.canvas`
  position: fixed;
  z-index: -1;
  width: 100%;
  height: 100%;
`;

const Gallexy = (props: any) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [startEffect, setStartEffect] = useState(false)
    const [start, setStart] = useState(false)
    const { angle } = props;
    let canvas = canvasRef.current;
    let ctx: any;

    const particleArray: [] = [];

    useEffect(() => {
        canvas = canvasRef.current;
        setStartEffect(true);
    }, [canvas])

    useEffect(() => {
        ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        setStart(true);
        animation();
    }, [startEffect])

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 5 + 1;
            this.speed = Math.random() * 2;
            this.speedX = this.speed * -8 * Math.sin(angle.animation.to);
            this.speedY = this.speed * 8 * Math.cos(angle.animation.to);
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.size > 0.2) this.size -= 0.05;
        }
        draw() {
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    const handleParticles = () => {
        if (!start) return;
        for (let i = 0; i < particleArray.length; i++) {
            particleArray[i].update();
            particleArray[i].draw();
            if (particleArray[i].size <= 0.3) {
                particleArray.splice(i, 1);
                i--;
            }
        }
    }

    const animation = () => {
        if (!start) return;
        // ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        particleArray.push(new Particle());
        handleParticles();
        requestAnimationFrame(animation);
        console.log(angle.animation.to);
    }

    return (
        <Canvas ref={canvasRef}></Canvas>
    )
}

export default Gallexy;
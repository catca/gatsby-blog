import React, { useState, useEffect, useRef } from 'react'
import { useSpring, to, animated, config } from 'react-spring'
import { scale, dist } from 'vec-la'
import { useDrag } from 'react-use-gesture'
import styled from '@emotion/styled'
import Gallaxy from './Gallexy'
import robot from './r.png'
import { number } from 'prop-types'

const Animated = styled(animated.div)`
    position: fixed;
    margin: auto;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: url(${robot}) no-repeat;
    background-size: contain;
    width: 140px;
    height: 140px;
    cursor: -webkit-grab;
    will-change: transform;
    user-select: none;

    &:active {
        cursor: -webkit-grabbing;
    }
`

function DragRocket() {
    const [{ pos }, set] = useSpring(() => ({ pos: [0, 0] }))
    const [{ angle }, setAngle] = useSpring(() => ({ angle: 0, config: config.wobbly }))
    const [isRunning, setIsRunning] = useState(false)
    const [windowSize, setWindowSize] = useState({
        width: undefined || number,
        height: undefined || number,
    });
    const rocketRef = useRef(0)

    const bind = useDrag(
        ({ xy, previous, down, movement: pos, velocity, direction }) => {
            set({ pos, immediate: down, config: { velocity: scale(direction, velocity * 0.5), decay: true } })
            if (dist(xy, previous) > 10 || !down) {
                setAngle({ angle: Math.atan2(direction[0], -direction[1]) })
            }
        },
        { initial: () => pos.get() }
    )

    useEffect(() => {
        if (typeof window !== 'undefined') {
            function handleResize() {
                setWindowSize({
                    width: window.innerWidth,
                    height: window.innerHeight,
                });
            }
            window.addEventListener("resize", handleResize);

            handleResize();
            return () => window.removeEventListener("resize", handleResize);
        }
    }, []);

    useInterval(() => {
        if (rocketRef.current.getBoundingClientRect().x < 0 && pos.animation.config.velocity[0] < 0) {
            set({ config: { velocity: [pos.animation.config.velocity[0] * -1 / 2, pos.animation.config.velocity[1] / 2] } })
            setAngle({ angle: angle.animation.toValues * -1 })
        }
        else if (rocketRef.current.getBoundingClientRect().x > windowSize.width - 140 && pos.animation.config.velocity[0] > 0) {
            set({ config: { velocity: [pos.animation.config.velocity[0] * -1 / 2, pos.animation.config.velocity[1] / 2] } })
            setAngle({ angle: angle.animation.toValues * -1 })
        }
        else if (rocketRef.current.getBoundingClientRect().y < 0 && pos.animation.config.velocity[1] < 0) {
            set({ config: { velocity: [pos.animation.config.velocity[0] / 2, pos.animation.config.velocity[1] * -1 / 2] } })
            setAngle({ angle: Math.PI - angle.animation.toValues })
        }
        else if (rocketRef.current.getBoundingClientRect().y > windowSize.height - 140 && pos.animation.config.velocity[1] > 0) {
            set({ config: { velocity: [pos.animation.config.velocity[0] / 2, pos.animation.config.velocity[1] * -1 / 2] } })
            setAngle({ angle: Math.PI - angle.animation.toValues })
        }
    }, isRunning ? 10 : null);

    function useInterval(callback, delay) {
        const savedCallback = useRef();

        useEffect(() => {
            savedCallback.current = callback;
        });

        useEffect(() => {
            function tick() {
                savedCallback.current();
            }

            if (delay !== null) {
                let id = setInterval(tick, delay);
                return () => clearInterval(id);
            } else {
                return () => { };
            }
        }, [delay]);
    }

    const onclick = () => {
        // console.log(pos.animation.config.velocity)
        // set({ config: { velocity: [pos.animation.config.velocity[0] * -1, pos.animation.config.velocity[1] * -1] } })
        // console.log(angle.animation.fromValues)
        // setAngle({ angle: angle.animation.fromValues * -1 })
        setIsRunning(true)
        setTimeout(() => {
            setIsRunning(false)
        }, 5000);
    }

    return (
        <>
            <Gallaxy angle={angle} />
            <Animated
                ref={rocketRef}
                {...bind()}
                style={{ transform: to([pos, angle], ([x, y], a) => `translate3d(${x}px,${y}px,0) rotate(${a}rad)`) }}
                onClick={onclick}
            />
        </>
    )
}

export default DragRocket;
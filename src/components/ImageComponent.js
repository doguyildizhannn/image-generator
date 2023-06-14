import React, { useEffect, useRef } from 'react'

const ImageComponent = (props) => {

    const pureSize = props.size.slice(0, 4).replace(/x/g, '');
    const pureSizeInt = parseInt(pureSize, 10);
    const spinnerSize = pureSize === "256" ? "2rem" : pureSize === "512" ? "4rem" : pureSize === "1024" ? "6rem" : "2rem";

    let dots = "";

    const handleThreeDots = () => {
        if (document.getElementById('threedots') !== null) {
            if (dots >= "....") dots = "";
            document.getElementById('threedots').innerHTML = "Generating" + dots;
            dots = dots + ".";
            setTimeout(handleThreeDots, 750);
        }
        else return;
    }

    const XYvalues = useRef({ x: 0, y: 0 });
    const ongoingTouches = useRef([]);

    useEffect(() => {
        if (props.loading && props.image === null) {
            handleThreeDots();
        }
        // eslint-disable-next-line
    }, [props.loading, props.image]);

    useEffect(() => {
        if (props.isCanvas) {
            let canvas = document.getElementById("myCanvas");
            let ctx = canvas.getContext("2d");
            const image = new Image();
            image.src = props.image;
            image.onload = () => {
                ctx.drawImage(image, 0, 0, pureSizeInt, pureSizeInt)
            }

            canvas.addEventListener('mousemove', draw);
            canvas.addEventListener('mousedown', setPosition);
            canvas.addEventListener('mouseenter', setPosition);

            canvas.addEventListener('touchstart', handleStart);
            canvas.addEventListener('touchend', handleEnd);
            canvas.addEventListener('touchcancel', handleCancel);
            canvas.addEventListener('touchmove', handleMove);
        }
        // eslint-disable-next-line
    }, [props.isCanvas, props.image]);

    const setPosition = (e) => {
        let canvas = document.getElementById("myCanvas");
        XYvalues.current.x = e.clientX - canvas.offsetLeft;
        XYvalues.current.y = e.clientY - canvas.offsetTop + document.documentElement.scrollTop;
        canvas.style.cursor = "crosshair";
    }

    const draw = (e) => {
        if (e.buttons !== 1) return;
        let canvas = document.getElementById("myCanvas");
        let ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.lineWidth = 35;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000000';
        ctx.moveTo(XYvalues.current.x, XYvalues.current.y);
        setPosition(e);
        ctx.lineTo(XYvalues.current.x, XYvalues.current.y);
        ctx.globalCompositeOperation = "destination-out";
        ctx.stroke();
    }

    const handleStart = (evt) => {
        let canvas = document.getElementById('myCanvas');
        evt.preventDefault();
        const touches = evt.changedTouches;
        XYvalues.current.x = canvas.getBoundingClientRect().left;
        XYvalues.current.y = canvas.getBoundingClientRect().top;
        for (let i = 0; i < touches.length; i++) {
            ongoingTouches.current.push(copyTouch(touches[i]));
        }
    }

    const handleMove = (evt) => {
        let canvas = document.getElementById('myCanvas');
        let context = canvas.getContext('2d');
        evt.preventDefault();
        const touches = evt.changedTouches;
        for (let i = 0; i < touches.length; i++) {
            const idx = ongoingTouchIndexById(touches[i].identifier);
            if (idx >= 0) {
                context.beginPath();
                context.moveTo(ongoingTouches.current[idx].clientX - XYvalues.current.x, ongoingTouches.current[idx].clientY - XYvalues.current.y);
                context.lineTo(touches[i].clientX - XYvalues.current.x, touches[i].clientY - XYvalues.current.y);
                context.lineWidth = 35;
                context.strokeStyle = '#000000';
                context.lineJoin = "round";
                context.closePath();
                context.globalCompositeOperation = "destination-out";
                context.stroke();
                ongoingTouches.current.splice(idx, 1, copyTouch(touches[i]));  // swap in the new touch record
            }
        }
    }

    const handleEnd = (evt) => {
        let canvas = document.getElementById('myCanvas');
        let context = canvas.getContext('2d');
        evt.preventDefault();
        const touches = evt.changedTouches;
        for (let i = 0; i < touches.length; i++) {
            let idx = ongoingTouchIndexById(touches[i].identifier);
            if (idx >= 0) {
                context.lineWidth = 35;
                context.fillStyle = '#000000';
                ongoingTouches.current.splice(idx, 1);  // remove it; we're done
            }
        }
    }

    const handleCancel = (evt) => {
        evt.preventDefault();
        const touches = evt.changedTouches;
        for (let i = 0; i < touches.length; i++) {
            let idx = ongoingTouchIndexById(touches[i].identifier);
            ongoingTouches.current.splice(idx, 1);  // remove it; we're done
        }
    }

    const copyTouch = ({ identifier, clientX, clientY }) => {
        return { identifier, clientX, clientY };
    }

    const ongoingTouchIndexById = (idToFind) => {
        for (let i = 0; i < ongoingTouches.current.length; i++) {
            const id = ongoingTouches.current[i].identifier;
            if (id === idToFind) {
                return i;
            }
        }
        return -1;    // not found
    }

    return (
        <div className='container' style={{ marginTop: "124px" }}>
            {
                props.isCanvas ?
                    <canvas className="mx-auto d-block" id="myCanvas" width={pureSize} height={pureSize} style={{ backgroundColor: "#919191" }}>
                    </canvas>
                    :
                    props.loading && props.image === null ?
                        <div className="mx-auto d-block" style={{ backgroundColor: "#919191", width: `${pureSize}px`, height: `${pureSize}px` }}>
                            <div className="row" style={{ height: pureSizeInt / 7 }}>
                            </div>
                            <div className="row" style={{ height: pureSizeInt / 7 }}>
                            </div>
                            <div className="row" style={{ height: pureSizeInt / 7 }}>
                            </div>
                            <div className="row" style={{ height: pureSizeInt / 7 }}>
                                <div className="d-flex justify-content-center">
                                    <div className="spinner-border" role="status" style={{ width: `${spinnerSize}`, height: `${spinnerSize}` }}>
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            </div>
                            <div className="row" style={{ height: pureSizeInt / 7 }}>
                                <div className="d-flex justify-content-center">
                                    <label id="threedots" style={{ fontWeight: "bold" }}></label>
                                </div>
                            </div>
                            <div className="row" style={{ height: pureSizeInt / 7 }}>
                            </div>
                            <div className="row" style={{ height: pureSizeInt / 7 }}>
                            </div>
                        </div>
                        :
                        !props.loading && props.image !== null ?
                            <div className="mx-auto d-block" style={{ backgroundColor: "#919191", width: `${pureSize}px`, height: `${pureSize}px` }}>
                                <img src={props.image} className="mx-auto d-block" alt="..." />
                            </div>
                            :
                            <div className="mx-auto d-block" style={{ backgroundColor: "#919191", width: `${pureSize}px`, height: `${pureSize}px` }}>
                            </div>
            }
        </div>
    )
}

export default ImageComponent;

import React, { useEffect, useRef, useState } from 'react'
import ImageComponent from './ImageComponent';

const MaskImage = (props) => {

    const count = 1;

    const alertMessage = "Check your apikey or description.";

    const size256 = "256x256";
    const size512 = "512x512";
    const size1024 = "1024x1024";

    const [size, setSize] = useState(size256);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [uploadedImageSize, setUploadedImageSize] = useState(size256);
    const [ghostImage, setGhostImage] = useState(null);
    const [uploadedImageFile, setUploadedImageFile] = useState(null);
    const [uploadedImageLoading, setUploadedImageLoading] = useState(false);
    const [text, setText] = useState("");
    const [isCanvas, setIsCanvas] = useState(true);
    const [brushSize, setBrushSize] = useState(10);

    const changeDisabilityOfAllButtons = (value) => {
        document.getElementById("size1").disabled = value;
        document.getElementById("size2").disabled = value;
        document.getElementById("size3").disabled = value;
        document.getElementById("generate").disabled = value;
        document.getElementById("uploadpng").disabled = value;
        document.getElementById("clearmask").disabled = value;

        //styling of upload custom button
        document.getElementById("uploadpnglabel").style.backgroundColor = value ? "#6f7174" : "#212529";
        document.getElementById("uploadpnglabel").style.cursor = value ? "default" : "pointer";
    }

    const setSizeAndButtons = (size) => {
        setSize(size);
        setCorrespondingSizeButtonDisabled(size);
    }

    const setCorrespondingSizeButtonDisabled = (size) => {
        if (size === size256) {
            document.getElementById("size1").disabled = true;
            document.getElementById("size2").disabled = false;
            document.getElementById("size3").disabled = false;
        }
        else if (size === size512) {
            document.getElementById("size1").disabled = false;
            document.getElementById("size2").disabled = true;
            document.getElementById("size3").disabled = false;
        }
        else if (size === size1024) {
            document.getElementById("size1").disabled = false;
            document.getElementById("size2").disabled = false;
            document.getElementById("size3").disabled = true;
        }
    }

    const textChanged = (event) => {
        setText(event.target.value);
    }

    const uploadPNG = (e) => {
        if (e.target.files[0].type !== "image/png") {
            props.showAlert(true, "File you uploaded is not in a valid format. Upload an image/png file.");
        }
        else if (e.target.files[0].size >= 4000000) {
            props.showAlert(true, "Upload an image/png file less than 4MB.");
        }
        else {
            let img = new Image();
            img.src = URL.createObjectURL(e.target.files[0])
            img.onload = () => {
                if (img.width !== img.height) {
                    props.showAlert(true, "Image you uploaded is not a square. Upload a square image.")
                }
                else {
                    setUploadedImage(URL.createObjectURL(e.target.files[0]));
                    setUploadedImageSize(img.width + "x" + img.height);
                    firstSize.current = img.width;
                    setUploadedImageFile(e.target.files[0]);
                    setGhostImage(URL.createObjectURL(e.target.files[0]));
                    document.getElementById("descText").value = "";
                }
            }
        }
    }

    const firstSize = useRef(256);

    const clearMaskedAreas = () => {
        setUploadedImage(URL.createObjectURL(uploadedImageFile));

        let sizePlus = firstSize.current - 1;
        setUploadedImageSize(sizePlus + 'x' + sizePlus);
    }

    useEffect(() => {
        if (uploadedImageSize === "255x255" || uploadedImageSize === "511x511" || uploadedImageSize === "1023x1023") {
            setUploadedImageSize(firstSize.current + 'x' + firstSize.current);
        }
    }, [uploadedImageSize])

    useEffect(() => {
        if (uploadedImage === null) document.getElementById("generate").disabled = true;
        else document.getElementById("generate").disabled = false;
    }, [uploadedImage])

    useEffect(() => {
        document.getElementById("size1").disabled = true;
    }, [])

    const generateImage = async (count, size, apiKey, text) => {
        let dataURL = document.getElementById("myCanvas").toDataURL();
        let response = await fetch(dataURL);
        let data = await response.blob();
        let metadata = {
            type: 'image/png'
        };
        let maskFile = new File([data], "myCanvas.png", metadata);
        if (maskFile === null) {
            props.showAlert(true, "An error occured during the transformation of the mask image. Try again later.");
        }
        else if (count >= 1 && (size === size256 || size === size512 || size === size1024)
            && apiKey !== null && apiKey !== "" && uploadedImageFile !== null && text !== "") {
            setUploadedImageLoading(true);
            setUploadedImage(null);
            setIsCanvas(false);
            changeDisabilityOfAllButtons(true);
            setUploadedImageSize(size);

            const formData = new FormData();
            formData.append('image', uploadedImageFile);
            formData.append('size', size);
            formData.append('n', count);
            formData.append('prompt', text);
            formData.append('mask', maskFile);

            const requestOptions = {
                method: 'POST',
                headers: {
                    // 'Content-Type': 'multipart/form-data',
                    'Authorization': 'Bearer ' + String(apiKey)
                },
                body: formData
            };

            let response = await fetch('https://api.openai.com/v1/images/edits', requestOptions)
            let parsedData = await response.json();

            if (parsedData.created !== null && parsedData.created !== undefined && parsedData.created > 0) {
                let imageUrl = parsedData.data[0].url;
                setUploadedImage(imageUrl);
                setUploadedImageLoading(false);
                setIsCanvas(true);
                changeDisabilityOfAllButtons(false);
                setCorrespondingSizeButtonDisabled(size);
            }
            else if (parsedData.error !== null && parsedData.error !== undefined) {
                console.log(parsedData.error.message);
                props.showAlert(true, parsedData.error.message)
                setUploadedImageLoading(false);
                setIsCanvas(true);
                changeDisabilityOfAllButtons(false);
                setCorrespondingSizeButtonDisabled(size);
            }
        }
        else { props.showAlert(true, alertMessage) }
    }

    const brushSizeChanged = (e) => {
        setBrushSize(e.target.value);
    }

    return (
        <div className='container'>
            <img src={ghostImage} alt="..." id="ghostimage" hidden></img>
            <ImageComponent image={uploadedImage} size={uploadedImageSize} loading={uploadedImageLoading} isCanvas={isCanvas} brushSize={brushSize} />
            <div className="mx-auto d-block my-5"
                style={{
                    padding: "7px",
                    textAlign: "justify",
                    width: "300px",
                    borderStyle: "solid",
                    borderWidth: "0.3px",
                    borderRadius: "4px",
                    backgroundColor: "#fff8d0"
                }}>
                <label><small><b><code>&#9432;</code></b><small><b> Upload a square image PNG file which is less than 4MB.
                    After that edit the areas that you would like to apply mask.
                    And finally choose a size and enter a description about what would you like to see as whole.</b></small></small></label>
            </div>
            <div className='container my-3'>
                <div className="d-grid gap-3 d-md-flex" style={{ justifyContent: "center" }}>
                    <label id="uploadpnglabel"
                        style={{
                            display: "inline-block",
                            padding: "6px 27px",
                            cursor: "pointer",
                            backgroundColor: "#212529",
                            color: "#ffffff",
                            borderRadius: "4px"
                        }}>
                        <input type="file" id="uploadpng" onChange={uploadPNG} />
                        Upload
                    </label>
                    <button className="btn btn-dark me-md" id="clearmask" type="button" onClick={clearMaskedAreas}>Clear Mask</button>
                </div>
            </div>
            <div className='container my-3'>
                <div className="d-grid gap-2 d-md-flex" style={{ justifyContent: "center" }}>
                    <label style={{
                        display: "inline-block",
                        paddingTop: "6px"
                    }} >Brush Size</label>
                </div>
                <div className="d-grid gap-2 d-md-flex" style={{ justifyContent: "center" }}>
                    <input type="range" className="form-range" id="brushsizerange" onChange={brushSizeChanged}
                        style={{
                            width: "200px",
                            paddingTop: "12px"
                        }} min="1" max="100" value={brushSize}></input>
                </div>
            </div>
            <div className='container my-5'>
                <div className="d-grid gap-2 d-md-flex" style={{ justifyContent: "center" }}>
                    <button className="btn btn-dark me-md-2" id="size1" type="button" onClick={() => setSizeAndButtons(size256)}>256x256</button>
                    <button className="btn btn-dark me-md-2" id="size2" type="button" onClick={() => setSizeAndButtons(size512)}>512x512</button>
                    <button className="btn btn-dark" id="size3" type="button" onClick={() => setSizeAndButtons(size1024)}>1024x1024</button>
                </div>
            </div>
            <div className='container my-5'
                style={{
                    width: "350px",
                }}>
                <textarea className="form-control" id="descText" placeholder="Describe the image." onChange={textChanged} style={{ height: "100px" }}></textarea>
            </div>
            <div className='container my-5'>
                <div className="d-grid gap-2 d-md-flex" style={{ justifyContent: "center" }}>
                    <button type="button" id="generate" className="btn btn-success" onClick={() => generateImage(count, size, props.apiKey, text)}><b>Generate Image</b></button>
                </div>
            </div>
        </div>
    )
}

export default MaskImage
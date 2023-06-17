import React, { useState } from 'react'
import ImageComponent from './ImageComponent';

const ImageVariation = (props) => {
    const count = 1;

    const alertMessage = "Check your apikey or upload an image for generating a variation of it.";
    const unexpectedErrorMessage = "An unexpected error occured. Try again later.";

    const size256 = "256x256";
    const size512 = "512x512";
    const size1024 = "1024x1024";

    const [image, setImage] = useState(null);
    const [size, setSize] = useState(size256);
    const [loading, setLoading] = useState(false);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [uploadedImageSize, setUploadedImageSize] = useState(size256);
    const [ghostImage, setGhostImage] = useState(null);
    // eslint-disable-next-line
    const [uploadedImageFile, setUploadedImageFile] = useState(null);
    // eslint-disable-next-line
    const [uploadedImageLoading, setUploadedImageLoading] = useState(false);

    const changeDisabilityOfAllButtons = (value) => {
        document.getElementById("size1").disabled = value;
        document.getElementById("size2").disabled = value;
        document.getElementById("size3").disabled = value;
        document.getElementById("generate").disabled = value;
        document.getElementById("uploadpng").disabled = value;

        //styling of upload custom button
        document.getElementById("uploadpnglabel").style.backgroundColor = value ? "#6f7174" : "#212529";
        document.getElementById("uploadpnglabel").style.cursor = value ? "default" : "pointer";
    }

    const setSizeAndImage = (size) => {
        setSize(size);
        setImage(null);
    }

    const uploadPNG = (e) => {
        if (e.target.files[0].type !== "image/png") {
            props.showAlert(true, "File you uploaded is not in a valid format. Upload an image/png file.");
        }
        else if (e.target.files[0].size >= 4000000) {
            props.showAlert(true, "Upload an image/png file less than 4MB.");
        }
        else {
            setGhostImage(URL.createObjectURL(e.target.files[0]));
            let img = new Image();
            img.src = URL.createObjectURL(e.target.files[0])
            img.onload = () => {
                if (img.width !== img.height) {
                    props.showAlert(true, "Image you uploaded is not a square. Upload a square image.")
                }
                else {
                    setUploadedImage(URL.createObjectURL(e.target.files[0]));
                    setUploadedImageSize(img.width + "x" + img.height);
                    setUploadedImageFile(e.target.files[0]);
                }
            }
        }
    }

    const generateImage = async (count, size, apiKey) => {
        if (count >= 1 && (size === size256 || size === size512 || size === size1024)
            && apiKey !== null && apiKey !== "" && uploadedImageFile !== null) {
            setLoading(true);
            setImage(null);
            changeDisabilityOfAllButtons(true);

            const formData = new FormData();
            formData.append('image', uploadedImageFile);
            formData.append('size', size);
            formData.append('n', count);

            const requestOptions = {
                method: 'POST',
                headers: {
                    // 'Content-Type': 'multipart/form-data',
                    'Authorization': 'Bearer ' + String(apiKey)
                },
                body: formData
            };

            fetch('https://api.openai.com/v1/images/variations', requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.created !== null && data.created !== undefined && data.created > 0) {
                        let imageUrl = data.data[0].url;
                        setImage(imageUrl);
                        setLoading(false);
                        changeDisabilityOfAllButtons(false);
                    }
                    else if (data.error !== null && data.error !== undefined) {
                        console.log(data.error.message);
                        props.showAlert(true, data.error.message)
                        setLoading(false);
                        changeDisabilityOfAllButtons(false);
                    }
                }).catch(err => {
                    console.log("Ran out of tokens for today! Try tomorrow!");
                    props.showAlert(true, unexpectedErrorMessage)
                });
        }
        else { props.showAlert(true, alertMessage) }
    }

    return (
        <div className='container'>
            <img src={ghostImage} alt="..." id="ghostimage" hidden></img>
            <ImageComponent image={uploadedImage} size={uploadedImageSize} loading={uploadedImageLoading} />
            <div className="mx-auto d-block my-5" style={{
                    padding: "7px",
                    textAlign: "justify",
                    width: "300px",
                    borderStyle: "solid",
                    borderWidth: "0.3px",
                    borderRadius: "4px",
                    backgroundColor: "#fff8d0"
                }}>
                <label><small><b><code>&#9432;</code></b><small><b> Upload a square image PNG file which is less than 4MB.</b></small></small></label>
            </div>
            <div className='container my-3'>
                <div className="d-grid gap-2 d-md-flex" style={{ justifyContent: "center" }}>
                    <label id="uploadpnglabel"
                        style={{
                            display: "inline-block",
                            padding: "6px 12px",
                            cursor: "pointer",
                            backgroundColor: "#212529",
                            color: "#ffffff",
                            borderRadius: "4px"
                        }}>
                        <input type="file" id="uploadpng" onChange={uploadPNG} />
                        Upload
                    </label>
                </div>
            </div>
            <div style={{ marginTop: "-75px" }}>
                <ImageComponent image={image} size={size} loading={loading} />
            </div>
            <div className='container my-5'>
                <div className="d-grid gap-2 d-md-flex" style={{ justifyContent: "center" }}>
                    <button className="btn btn-dark me-md-2" id="size1" type="button" onClick={() => setSizeAndImage(size256)}>256x256</button>
                    <button className="btn btn-dark me-md-2" id="size2" type="button" onClick={() => setSizeAndImage(size512)}>512x512</button>
                    <button className="btn btn-dark" id="size3" type="button" onClick={() => setSizeAndImage(size1024)}>1024x1024</button>
                </div>
            </div>
            <div className='container my-5'>
                <div className="d-grid gap-2 d-md-flex" style={{ justifyContent: "center" }}>
                    <button type="button" id="generate" className="btn btn-success" onClick={() => generateImage(count, size, props.apiKey)}><b>Generate Image</b></button>
                </div>
            </div>
        </div>
    )
}

export default ImageVariation
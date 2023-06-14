import React, { useState } from 'react'
import ImageComponent from './ImageComponent';

const GenerateImage = (props) => {

    const count = 1;

    const alertMessage = "Check your apikey or description.";
    const unexpectedErrorMessage = "An unexpected error occured. Try again later.";

    const size256 = "256x256";
    const size512 = "512x512";
    const size1024 = "1024x1024";

    const [image, setImage] = useState(null);
    const [size, setSize] = useState(size256);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);

    const textChanged = (event) => {
        setText(event.target.value);
    }

    const changeDisabilityOfAllButtons = (value) => {
        document.getElementById("size1").disabled = value;
        document.getElementById("size2").disabled = value;
        document.getElementById("size3").disabled = value;
        document.getElementById("generate").disabled = value;
    }

    const setSizeAndImage = (size) => {
        setSize(size);
        setImage(null);
    }

    const generateImage = async (count, size, text, apiKey) => {
        if (count >= 1 && (size === size256 || size === size512 || size === size1024)
            && text !== "" && apiKey !== null && apiKey !== "") {
            setLoading(true);
            setImage(null);
            changeDisabilityOfAllButtons(true);
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(apiKey)
                },
                body: JSON.stringify({
                    'prompt': text,
                    'n': count,
                    'size': size,
                })
            };
            fetch('https://api.openai.com/v1/images/generations', requestOptions)
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
            <ImageComponent image={image} size={size} loading={loading} />
            <div className='container my-5'>
                <div className="d-grid gap-2 d-md-flex" style={{ justifyContent: "center" }}>

                    <button className="btn btn-dark me-md-2" id="size1" type="button" onClick={() => setSizeAndImage(size256)}>256x256</button>
                    <button className="btn btn-dark me-md-2" id="size2" type="button" onClick={() => setSizeAndImage(size512)}>512x512</button>
                    <button className="btn btn-dark" id="size3" type="button" onClick={() => setSizeAndImage(size1024)}>1024x1024</button>
                </div>
            </div>
            <div className='container my-5' style={{ paddingLeft: "50px", paddingRight: "50px" }}>
                <textarea className="form-control" placeholder="Describe the image that you would like to generate." onChange={textChanged} style={{ height: "100px" }}></textarea>
            </div>
            <div className='container my-5'>
                <div className="d-grid gap-2 d-md-flex" style={{ justifyContent: "center" }}>
                    <button type="button" id="generate" className="btn btn-success" onClick={() => generateImage(count, size, text, props.apiKey)}><b>Generate Image</b></button>
                </div>
            </div>
        </div>
    )
}

export default GenerateImage;

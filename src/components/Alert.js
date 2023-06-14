import React from 'react'

const Alert = (props) => {
    return (
        <div>
            {props.alert.isSet &&
                <div className="alert alert-warning alert-dismissible fade show" role="alert"
                    style={{
                        position: "fixed",
                        width: "100%",
                        marginTop: "-63px",
                        textAlign: "center",
                        paddingRight: "1rem"
                    }}>
                    {props.alert.message}
                </div>
            }
        </div>
    )
}

export default Alert
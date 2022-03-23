import React from "react";
import { useState } from "react";
import './asset/modal.css';

const Modal = (props) => {
    const {open, close, header, userid} = props;
    const [edited, setEdited] = useState({
        updateText: ''
    });
    const { text } = edited;
    //update text 부분 업데이트 가능하게 
    const onEditChange = (e) => {
        setEdited({
            ...edited,
            [e.target.name] : e.target.value,
        })
    }
    //data delete
    function onUpdate(text) {
        const requestid = {
            "id": userid,
            "text": edited.updateText,
        };
        const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestid)
        };
        fetch('http://localhost:8080/updatetext',requestOptions)
        .then((users) => {console.log("fetch : " +users)})
        .then(close)
    }


    return (
        <div className={open ? 'openModal modal' : 'modal'}>
            {open ? (
                <section>
                    <header>
                        {header}
                        <button className="close" onClick={close}>
                        &times;
                        </button>
                    </header>
                    <main>
                        <input type="text" name="updateText" value={text} placeholder={props.children} onChange={onEditChange}></input>
                        <button onClick={()=> onUpdate(text)}>입력</button></main>
                    <footer>
                        <button className="close" onClick={close}>
                            close
                        </button>
                    </footer>
                </section>
            ) : null }
        </div>  
     );
};

export default Modal;
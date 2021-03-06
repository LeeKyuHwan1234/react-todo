import './App.css';
import { useEffect, useState, useRef } from 'react';
import React from 'react';
import { MdEdit,MdDelete, MdCheckBox } from "react-icons/md";
import { RiSave3Fill, RiCheckboxBlankCircleLine, RiCheckboxCircleLine } from "react-icons/ri";

function App() {
  const [loading, setloading] = useState(false);

  const [users, setUser] = useState("");
  const [inputs, setInputs] = useState({
    todotext: ''
  });
  const { text } = inputs;
  const [edited, setEdited] = useState({
    updateText: ''
  });
  const [editNum, setEditNum] = useState({
    updateText: ''
  });
  const [updateEdited, setUpdateEdited] = useState('');
  const { updateTexts } = updateEdited;
  const [editState, setEditStates] = useState(false);
  //update text 부분 업데이트 가능하게 
  const onEditChange = (e) => {
    setUpdateEdited({
      ...updateEdited,
      [e.target.name]: e.target.value,
    })
  }
  function select() {
    fetch('http://localhost:8080/todo/select')
          .then((res) => res.json())
          .then((users) => {
            setloading(false);
            setUser(users);
          }) 
  }
  //input text 부분 글쓸수있게해
  const onChange = e => {
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      [name]: value
    });
  };

  const nextId = useRef(1);
  // data insert
  const onCreate = () => {
    const user = {
      id: nextId.current,
      text,
      done: false
    };
    const requestuser = {
      text,
      done: false
    };

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestuser)
    };
    if(text == "" || text == undefined || text == null){
      alert("할 일을 입력해주세요")
    }
    else {
      fetch('http://localhost:8080/todo/insert', requestOptions)
        .then(() => { 
          select()
      })
      nextId.current += 1;
    }
  }
 
  //data delete
  function onDelete(id) {
    const requestid = {
      id
    };
    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestid)
    };
    fetch('http://localhost:8080/todo/delete', requestOptions)
      .then(() => { 
        select()
    })

    // const removeItem = (Object.values(users)).filter((user) => {
    //    return user.id !== id 
    // });
    // setUser(removeItem);
   }
  //data delete
  function onUpdate(id, text) {
    setEditStates(true);
    setEditNum(id);
    setEdited(text);
  }

  const onUpdate2 = (id) => {
    const requestid = {
      "id": id,
      "text": Object.values(updateEdited)[0],
    };
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestid)
    };
    if(requestid.text == "" || requestid.text == undefined || requestid.text == null){
      alert("할 일을 입력해주세요")
    }
    else {
    fetch('http://localhost:8080/todo/updatetext', requestOptions)
      .then((users) => { 
        select()
    })  
    setEditStates(false);
    }
    //  const updateItem = (Object.values(users)).map((user) => { 
    //    return id === user.id ? user.text : updateTexts   
    //  });
    //  setUser(updateItem)
  }

  const onUpdateDoneFalsetoTrue = (id) => {
    const requestid = {
      "id": id,
      "done": true
    };
    console.log(requestid.id)
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestid)
    };
    fetch('http://localhost:8080/todo/updatedone', requestOptions)
      .then((users) => { 
        select()
    })
  }
  const onUpdateDoneTruetoFalse = (id) => {
    const requestid = {
      "id": id,
      "done": false
    };
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestid)
    };
    fetch('http://localhost:8080/todo/updatedone', requestOptions)
      .then((users) => { 
        select()
    })
  }

  //data select 
  useEffect(() => {
    select()
    }, []);

  let todoList = Object.values(users).map((user) => (
    <div className='todoItem'>
      {
        (user.done === "false") 
        ?( <RiCheckboxBlankCircleLine size="50" className='checkedblankbtn' onClick={()=>onUpdateDoneFalsetoTrue(user.id)}></RiCheckboxBlankCircleLine>) 
        : (<RiCheckboxCircleLine size="50"className='checkedbtn' onClick={()=>onUpdateDoneTruetoFalse(user.id)}></RiCheckboxCircleLine>)
      }
      <li key={user.id} className="todoli" style={{"list-style": "none"}}>
        {
          editState && user.id === editNum 
          ?(<span><input className="inputtext"  type="text" id={user.text} value={updateTexts} placeholder={edited} onChange={onEditChange}></input></span>) 
          :((user.done ==="false")
            ?(<span className="todotext">{user.text}</span>)
            :(<span className="todochecktext">{user.text}</span>))       
        }         
        {
          editState && (user.id === editNum)
            ? (<RiSave3Fill  className="savebtn" size="35" color="green"onClick={() => onUpdate2(user.id)}></RiSave3Fill>)
            : (<MdEdit  className="modbtn" size="35" color="blue" onClick={() => onUpdate(user.id, user.text)}></MdEdit>)
        }
        <MdDelete  className="delbtn" size="35" color="red" onClick={() => onDelete(user.id)}>삭제 </MdDelete></li>
    </div>
    )
  );
  if (loading) return <div>Loading...</div>;
  return (
    <>
      <div className='todoTemplate'>
        <div className='todoHeader'>TODO  LIST</div>
        <div className='todoList'>
          <div className="inputlist">
            <input className='inputlistst' name="text" type="text" placeholder="할 일을 입력하세요" value={text || ''} onChange={onChange} />&nbsp;
            <MdEdit className="inputicon" onClick={onCreate}>입력</MdEdit>
          </div>
          <ul>
          {todoList}<br />
        </ul>
        </div>
      </div>
    </>
  );
}

export default App;


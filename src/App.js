import './App.css';
import { useEffect, useState, useRef } from 'react';
import React from 'react';

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
    fetch('http://localhost:8080/todo/insert', requestOptions)
      .then((users) => { console.log(users) })

    setUser(users.concat(user));
    setloading(false);
    setInputs({
      text: ''
    });
    nextId.current += 1;
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
    console.log(requestOptions.body)
    fetch('http://localhost:8080/todo/delete', requestOptions)
      .then((users) => { console.log("fetch : " + users) })

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
    fetch('http://localhost:8080/todo/updatetext', requestOptions)
      .then((users) => { console.log("fetch : " + users) })
      .then()
    setEditStates(false);
    console.log(requestid.text)
    //  const updateItem = (Object.values(users)).map((user) => { 
    //    return id === user.id ? user.text : updateTexts   
    //  });
    //  setUser(updateItem)
  }
  //data select 
  useEffect(() => {
    fetch('http://localhost:8080/todo/select')
      .then((res) => res.json())
      .then((users) => {
        console.log(users)
        setloading(false);
        setUser(users);
      })
  }, []);

  let todoList = Object.values(users).map((user) => (
    <div className='todoItem'>
      <li key={user.id} style={{ "list-style": "none" }}>
        {
          editState && user.id === editNum ? (<span><input className="btn1234"  type="text" id={user.text} value={updateTexts} placeholder={edited} onChange={onEditChange}></input></span>) : (<span className="todotext">{user.text}</span>)
        }
        {
          !editState
            ? (<button onClick={() => onUpdate(user.id, user.text)}>수정</button>)
            : (<button onClick={() => onUpdate2(user.id)}>저장</button>)
        }
        <button onClick={() => onDelete(user.id)}>삭제</button></li>
      </div>
  )
  );
  if (loading) return <div>Loading...</div>;
  return (
    <>
      <div className='todoTemplate'>
        <div className='todoHeader'>TODO-LIST</div>
        <div className='todoList'>
          <ul>
          {todoList}<br />
          <input name="text" type="text" placeholder="입력하세요" value={text || ''} onChange={onChange} />&nbsp;<button onClick={onCreate}>입력</button>
      </ul>
      </div>
      </div>
    </>
  );
}
export default App;


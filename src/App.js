import './App.css';
import {useEffect, useState ,useRef} from 'react';
import React from 'react';
import Modal from './modal';

function App() {
  const [inputs, setInputs]= useState({
    todotext: ''
  });
  const { text } = inputs;
  const [edited, setEdited] = useState({
    updateText: ''
  });
  const [editNum, setEditNum] = useState({
    updateText: ''
  });
  const { updateTexts } = edited;
  const [editState, setEditStates] = useState(false);
//update text 부분 업데이트 가능하게 
const onEditChange = (e) => {
    setEdited({
        ...edited,
        [e.target.name] : e.target.value,
    })
}
  const [users, setUser] = useState("");
  //input text 부분 글쓸수있게해
  const onChange = e => {
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      [name]:value
    });
  };
  //data select 
  useEffect(()=> {
    window
    .fetch('http://localhost:8080/todolist')
    .then((res) => res.json())
    .then((users) => {
      console.log(users)
      setUser(users);
    })
    .catch((error) => {
      console.log(error);
    });
  }, []);

  const nextId = useRef(1);
  // data insert
  const onCreate = () => {
      const user = {
        id: nextId.current,
        text,
        done : false
      };
      const requestuser = {
        text,
        done : false
      };

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestuser)
      };
      fetch('http://localhost:8080/inserttodo',requestOptions)
      .then((users) => {console.log(users)})      
      setUser(users.concat(user));
      setInputs({
        text:''
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
    fetch('http://localhost:8080/deletetodo',requestOptions)
    .then((users) => {console.log("fetch : " +users)})      
    
    const removeItem = (Object.values(users)).filter((user) => {
       return user.id !== id 
    });
    setUser(removeItem);
  }
  
  //data delete
  function onUpdate(id, text) {
    setEditStates(true);
    setEditNum(id);
    setEdited(text);
  }
const onUpdate2 = (id, text) => {
  const requestid = {
      "id": id,
      "text": edited.updateText,
    };
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestid)
    };
    fetch('http://localhost:8080/updatetext',requestOptions)
    .then((users) => {console.log("fetch : " +users)})
    .then()
    setEditStates(false);
}
  
  let todoList = Object.values(users).map((user) => (
      
      <li key={user.id} style={{"list-style": "none"}}>
      {
      editState && user.id === editNum ?( <span><input type="text" id={user.id} value={updateTexts} placeholder={edited} onChange={onEditChange}></input></span>) : (<span>{user.text}</span>)
      }
      {
        !editState
          ? (<button onClick={()=> onUpdate(user.id, user.text)}>수정</button>)
          : (<button onClick={()=> onUpdate2(user.id, user.text)}>저장</button>
        )
      }
      
      <button onClick={()=> onDelete(user.id)}>삭제</button></li> 
      
      )
    );
  
  return (
    <>
    <ul>
      {todoList}<br/>
      <input name="text" type="text" placeholder="입력하세요" value={text || ''} onChange={onChange} />&nbsp;<button onClick={onCreate}>입력</button>
    </ul>
    </>
  );
}
export default App;


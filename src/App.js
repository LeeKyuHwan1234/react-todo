import './App.css';
import {useEffect, useState ,useRef} from 'react';
import React from 'react';
import Modal from './modal';

function App() {
  const [inputs, setInputs]= useState({
    todotext: ''
  });
  const { text } = inputs;
  const [modalOpen, setModalOpen] = useState(false);
  const [modalText, setmodalText] = useState("");
  const [modalHead, setmodalHead] = useState("");
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

    // const onEdit = (e) => {
    //   const { name, value } = e.target;
    //   setModalOpen({
    //     ...modalOpen,
    //     [name]:value
    //   });
    // };

    const openModal = (text,id) => {
      setModalOpen(true);
      setmodalText(text)
      setmodalHead(id);
    };
    const closeModal = () => {
      setModalOpen(false);
    };

  let todoList = Object.values(users).map((user) => (
    <React.Fragment>
    <li key={user.id} style={{"list-style": "none"}}>
      <span>{user.text}</span>&nbsp;
      <button onClick={()=> openModal(user.text, user.id)}>수정</button>&nbsp;
      <Modal open={modalOpen} close={closeModal} header="할 일 수정하기" userid={modalHead}>{modalText}</Modal> 
      <button onClick={()=> onDelete(user.id)}>삭제</button></li>
      </React.Fragment>
      )
    );
  
  
  return (
    <>
    <ul>
      {todoList}
      <input name="text" type="text" placeholder="입력하세요" value={text || ''} onChange={onChange} /><button onClick={onCreate}>입력</button>
    </ul>
    </>
  );
}
export default App;


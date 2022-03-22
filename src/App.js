import './App.css';
import { useEffect, useState ,useRef} from 'react';

function App() {
  const [edited, setEdited] = useState(false);
  const [inputs, setInputs]= useState({
    todotext: ''
  });
  const { text } = inputs;
  // const [checkbox, setChecks] = useState({
  //   checkbox
  // })

  //input text 부분 글쓸수있게해
  const onChange = e => {
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      [name]:value
    });
  };
  
  const [users, setUser] = useState("");
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

  function onClickEditButton(id) {
    const index = users.findIndex(user => user.id === id);
    console.log(index)    
    setEdited(true);
  }
 
  const onClickEditButton2 = () => { setEdited(false); };

  let todoList = Object.values(users).map((user) => (
      <li key={user.id} style={{"list-style": "none"}}>
      <input type="checkbox" name="checkbox" value={user.id}/> {
      edited ? ( <input type="text" name="" defaultValue={user.text}></input>) :(<span>{user.text}</span>)}    
      <button onClick={()=> onClickEditButton(user.id)}>true</button> 
      <button onClick={onClickEditButton2}>false</button>
      <button onClick={()=> onDelete(user.id)}>삭제</button></li>)
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


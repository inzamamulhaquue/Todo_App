import React, { useState, useEffect } from 'react';
import './Todo.css';
import TodoCards from './TodoCards';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Update from './Update';
import axios from 'axios';

let id = sessionStorage.getItem('id');
let toUpdateArray = [];

const Todo = () => {
    const [Inputs, setInputs] = useState({
        title: '', description: ''
    });
    const [Array, setArray] = useState([]);

    const show = () => {
        document.getElementById('textarea').style.display = 'block';
    };

    const change = (e) => {
        const { name, value } = e.target;
        setInputs({ ...Inputs, [name]: value });
    };

    //press ecter in title then cursor goto description..
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            document.getElementById('textarea').focus();
        }
    };

    const submit = async () => {
        if (Inputs.title === "" || Inputs.description === "") {
            toast.error('Title Or Description Never Blank');
        } else {
            if (id) {
                await axios
                    .post('http://localhost:4004/api/tasks/addTask', {
                        title: Inputs.title,
                        description: Inputs.description,
                        id: id,
                    })
                    .then((response) => {
                        console.log(response);
                    });
                setInputs({ title: "", description: "" });
                toast.success("Your Task Is Added");
            } else {
                setArray([...Array, Inputs]);
                setInputs({ title: "", description: "" });
                toast.success("Your Task Is Added");
                toast.error("Your Task Is Not Saved ! Please SignUp");
            }
        }
    };

    const del = async (Cardid) => {
        if (id) {
            await axios
                .delete(`http://localhost:4004/api/tasks/deleteTask/${Cardid}`, {
                    data: { id: id },
                })
                .then(() => {
                    toast.success("Your Task Is Deleted");
                });
        } else {
            toast.error("Please SignUp First");
        }
    };

    const dis = (value) => {
        document.getElementById('todo-update').style.display = value;
    };

    const update = (value) => {
        toUpdateArray = Array[value];
    };

    useEffect(() => {
        if (id) {
            const fetch = async () => {
                await axios
                    .get(`http://localhost:4004/api/tasks/getTasks/${id}`)
                    .then((response) => {
                        setArray(response.data.task);
                    });
            };
            fetch();
        }
    }, [submit]);

    return (
        <>
            <div className='todo'>
                <ToastContainer />
                <div className="todo-main container d-flex justify-content-center align-items-center my-4 flex-column">
                    <div className="d-flex flex-column todo-inputs-div w-100 p-1">
                        <input
                            type='text'
                            placeholder='TITLE'
                            className='my-2 p-2 todo-inputs'
                            onClick={show}
                            name='title'
                            value={Inputs.title}
                            onChange={change}
                            onKeyPress={handleKeyPress}
                        />
                        <textarea
                            id='textarea'
                            type='text'
                            placeholder='DESCRIPTION'
                            className='p-2 todo-inputs'
                            name='description'
                            value={Inputs.description}
                            onChange={change}
                        />
                    </div>
                    <div className='w-lg-50 w-100 d-flex justify-content-end my-2'>
                        <button className='home-btn px-2 p-1' onClick={submit}>Add</button>
                    </div>
                </div>
                <div className="todo-body">
                    <div className="container-fluid">
                        <div className="row">
                            {Array && Array.map((item, index) => (
                                <div className="col-lg-3 col-11 mx-lg-5 mx-3 my-2" key={index}>
                                    <TodoCards
                                        title={item.title}
                                        description={item.description}
                                        id={item._id}
                                        delid={del}
                                        display={dis}
                                        updateId={index}
                                        toBeUpdate={update}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="todo-update " id="todo-update">
                <div className="container update">
                    <Update display={dis} update={toUpdateArray} />
                </div>
            </div>
        </>
    );
};

export default Todo;





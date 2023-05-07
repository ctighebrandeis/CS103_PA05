import React, { useState, useEffect } from "react";
import "./styles.css";

const initTodos = [
  {
    itemID: 0,
    desc: "eat lunch",
    amount: 23,
    category: "food",
    date: "5/02/2023"
  },
  {
    itemID: 1,
    desc: "walk dog",
    amount: 12,
    category: "test",
    date: "4/28/2023"
  }
];

localStorage.setItem("items", JSON.stringify(initTodos));

function getItemsFromLocalStorage() {
  // getting stored value
  const saved = localStorage.getItem("items");
  const initialValue = JSON.parse(saved) || [];
  // relabel the keys from 0 to length-1
  for (let i = 0; i < initialValue.length; i++) {
    initialValue[i]["itemID"] = i;
  }
  return initialValue || [];
}

export default function App() {
  let [items, setItems] = useState(getItemsFromLocalStorage);
  let [numKeys, setNumKeys] = useState(() => items.length);
  let [msg, setMsg] = useState("none");

  function add_item() {
    // add an item to the transaction list
    const item = document.getElementById("item").value;
    const amt = document.getElementById("amt").value;
    const date = document.getElementById("date").value;
    const cat = document.getElementById("cat").value;
    let newItem = {
      itemID: numKeys,
      desc: item,
      amount: amt,
      date: date,
      category: cat
    };
    document.getElementById("item").value = "";
    setNumKeys(numKeys + 1);
    setItems([newItem, ...items]); // using the spread operator ...
  }

  function deleteItem(key) {
    console.log(key);
    let newItems = items.filter((x) => x["itemID"] !== key);
    for (let i = 0; i < newItems.length; i++) {
      newItems[i]["itemID"] = i;
    }
    setItems(newItems);
    setNumKeys(numKeys - 1);
  }

  useEffect(() => {
    // storing items if items changes value
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  // // demo of how to get data from an Express server
  // useEffect(() => {
  //   const getMsg = async () => {
  //     const response = await fetch('http://localhost:3000/test');
  //     const result = await response.json();
  //     setMsg(result);
  //     console.log('msg =',result);
  //   }
  //   getMsg()
  // },[msg])

  // this is used to allow text data to be submitted
  // when the user hits the 'Enter' key
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      // 👇 Get input value
      add_item();
    }
  };

  return (
    <div className="App">
      <h1>Chris's Transaction List</h1>
      {msg}
      <table style={{ width: "100%" }}>
        <tr>
          <th>delete</th>
          <th>description</th>
          <th>category</th>
          <th>amount</th>
          <th>date</th>
        </tr>
        <tbody>
          {items.map((item) => (
            <tr>
              <td>
                <button onClick={() => deleteItem(item["itemID"])}>X</button>
              </td>
              <td>{item["desc"]}</td>
              <td>{item["category"]}</td>
              <td>{item["amount"]}</td>
              <td>{item["date"]}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2> add new todo item </h2>
      <input
        type="text"
        onKeyDown={handleKeyDown}
        id="item"
        placeholder="description"
      />
      <br></br>
      <input
        type="text"
        onKeyDown={handleKeyDown}
        id="amt"
        placeholder="amount"
      />
      <br></br>
      <input
        type="text"
        onKeyDown={handleKeyDown}
        id="date"
        placeholder="MM/DD/YYYY"
      />
      <br></br>
      <input
        type="text"
        onKeyDown={handleKeyDown}
        id="cat"
        placeholder="category"
      />
      <br></br>
      <button onClick={() => add_item()}>add Todo</button>

      <h2> DEBUGGING: list of items in JSON </h2>
      <pre>{JSON.stringify(items, null, 5)}</pre>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import "./styles.css";

const initTodos = [
  {
    itemID: 0,
    desc: "bought lunch",
    amount: 23,
    category: "food",
    date: "05/02/2023",
    month: 5,
    year: 2023
  },
  {
    itemID: 1,
    desc: "test xactn",
    amount: 12,
    category: "test",
    date: "4/28/2023",
    month: 4,
    year: 2023
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
  let [sumBy, setSumBy] = useState("None");

  function add_item() {
    // add an item to the transaction list
    const item = document.getElementById("item").value;
    const amt = Number(document.getElementById("amt").value);
    const date = document.getElementById("date").value;
    const cat = document.getElementById("cat").value;
    const date_decon = date.split("/");
    // Made the items have undisplayed entries for year and month to make grouping easier
    let newItem = {
      itemID: numKeys,
      desc: item,
      amount: amt,
      date: date,
      category: cat,
      month: date_decon[0],
      year: date_decon[2]
    };
    document.getElementById("item").value = "";
    document.getElementById("amt").value = "";
    document.getElementById("date").value = "";
    document.getElementById("cat").value = "";

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

  function groupBy(column) {
    let newsum = {};

    // I would have liked to use an Array.prototype.group() call,
    // but it's experimental so not usable in codesandbox

    for (let i = 0; i < numKeys; i++) {
      if (items[i][column] in newsum) {
        console.log(newsum);
        newsum[items[i][column]] =
          Number(newsum[items[i][column]]) + Number(items[i]["amount"]);
        console.log(newsum);
      } else {
        newsum[items[i][column]] = Number(items[i]["amount"]);
      }
    }
    console.log(newsum);
    return newsum;
  }

  useEffect(() => {
    // storing items if items changes value
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

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
      <table style={{ width: "100%" }}>
        {sumBy === "None" ? (
          <tr>
            <th>delete</th>
            <th>description</th>
            <th>category</th>
            <th>amount</th>
            <th>date</th>
          </tr>
        ) : (
          <tr>
            <th>{sumBy}</th>
            <th>amount</th>
          </tr>
        )}
        <tbody>
          {sumBy === "None"
            ? items.map((item) => (
                <tr>
                  <td>
                    <button onClick={() => deleteItem(item["itemID"])}>
                      X
                    </button>
                  </td>
                  <td>{item["desc"]}</td>
                  <td>{item["category"]}</td>
                  <td>{item["amount"]}</td>
                  <td>{item["date"]}</td>
                </tr>
              ))
            : Object.entries(groupBy(sumBy)).map((arr) => (
                <tr>
                  <td>{arr[0]}</td>
                  <td>{arr[1]}</td>
                </tr>
              ))}
        </tbody>
      </table>
      <h4>Summarize By:</h4>
      <button onClick={() => setSumBy("date")}>date</button>
      <button onClick={() => setSumBy("month")}>month</button>
      <button onClick={() => setSumBy("year")}>year</button>
      <button onClick={() => setSumBy("category")}>category</button>
      <button onClick={() => setSumBy("None")}>nothing</button>

      <h2> add new todo item </h2>
      <input
        type="text"
        onKeyDown={handleKeyDown}
        id="item"
        placeholder="description"
      />
      <br />
      <input
        type="text"
        onKeyDown={handleKeyDown}
        id="amt"
        placeholder="amount"
      />
      <br />
      <input
        type="text"
        onKeyDown={handleKeyDown}
        id="date"
        placeholder="MM/DD/YYYY"
      />
      <br />
      <input
        type="text"
        onKeyDown={handleKeyDown}
        id="cat"
        placeholder="category"
      />
      <br />
      <button onClick={() => add_item()}>add Todo</button>
      <br />

      <h2> DEBUGGING: list of items in JSON </h2>
      <pre>{JSON.stringify(items, null, 5)}</pre>
    </div>
  );
}

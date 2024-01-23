import { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import "../style.css"

function IndexPopup() {
  const [list, setList] = useState([])
  useEffect(() => {
    sendToBackground({
      name: "getReadList"
    }).then((res) => {
      setList(res.body)
    })
  }, [])
  async function addToList() {
    const res = await sendToBackground({
      name: "saveToList"
      // data: {
      //   list: list
      // }
    })
    setList(res.body)
  }

  return (
    <div className="w-20">
      <div>
        <button onClick={addToList}>add to list</button>
      </div>
      <div>
        {list.map((item) => {
          return <div>{item.title}</div>
        })}
      </div>
    </div>

    // <button
    //   onClick={() => increase(1)}
    //   type="button"
    //   className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
    //   Count:
    //   <span className="inline-flex items-center justify-center w-8 h-4 ml-2 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full">
    //     {count}
    //   </span>
    // </button>
  )
}
export default IndexPopup

import "../style.css"

import { usePage } from "./use"

function IndexPopup() {
  const Page = usePage()

  return (
    <div className="w-80 p-2">
      <Page />
    </div>
  )
}
export default IndexPopup

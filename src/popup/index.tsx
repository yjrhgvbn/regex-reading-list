import "../style.css"

import { usePage } from "./use"

function IndexPopup() {
  const Page = usePage()

  return (
    <div className="w-96">
      <Page />
    </div>
  )
}
export default IndexPopup

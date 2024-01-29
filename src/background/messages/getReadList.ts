import type { PlasmoMessaging } from "@plasmohq/messaging"

import type { ReadRecord } from "../../interface"
import { getList } from "../utils/storage"

const handler: PlasmoMessaging.MessageHandler<
  undefined,
  {
    body: ReadRecord[]
  }
> = async (req, res) => {
  const list = await getList()
  res.send({
    body: list
  })
}
export default handler

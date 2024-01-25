import type { PlasmoMessaging } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

import type { ReadRecord } from "../../interface"
import { getList } from "../utils/storage"

const storage = new Storage()

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

import type { PlasmoMessaging } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

import type { ReadRecord } from "../../interface"
import { listStorageKey } from "../utils/const"

const storage = new Storage()

const handler: PlasmoMessaging.MessageHandler<
  undefined,
  {
    body: ReadRecord[]
  }
> = async (req, res) => {
  const listStr = (await storage.get(listStorageKey)) || "[]"
  try {
    const list: ReadRecord[] = JSON.parse(listStr)
    res.send({
      body: list
    })
  } catch (e) {
    res.send({
      body: []
    })
  }
}
export default handler

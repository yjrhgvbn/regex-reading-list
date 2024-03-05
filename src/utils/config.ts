import { Storage } from "@plasmohq/storage"

import { CONFIG_KEY, ConfigEnum, configSetting } from "./const"

const storage = new Storage()

export async function getConfig<T extends ConfigEnum>(key: T): Promise<(typeof configSetting)[T]> {
  const configs = (await storage.get<Record<string, any>>(CONFIG_KEY)) || {}
  const value = configs[ConfigEnum.updateOnlyOpenByPlugin] || configSetting[key]
  return value
}

import { Storage } from "@plasmohq/storage"

export const CONFIG_KEY = "read-config"

// options setting with default value
export enum ConfigEnum {
  updateOnlyOpenByPlugin = "updateOnlyOpenByPlugin"
}

const configSetting = {
  [ConfigEnum.updateOnlyOpenByPlugin]: {
    value: true,
    title: "update progress only open page by plugin" as const,
    describe: ""
  }
}
export type ConfigSettings = typeof configSetting
export type ConfigValues = { [key in ConfigEnum]: ConfigSettings[key]["value"] }
const storage = new Storage()
let configCacheValue: Partial<ConfigValues>

export async function getConfigValue<T extends ConfigEnum>(key: T): Promise<ConfigSettings[T]["value"]> {
  if (!configCacheValue) await getConfigs()
  const value = configCacheValue[key] || configSetting[key].value
  return value
}

export function setConfigValue<T extends ConfigEnum>(key: T, value: ConfigSettings[T]["value"]) {
  configCacheValue[key] = value
  storage.set(CONFIG_KEY, configCacheValue)
}

export async function getConfigs() {
  if (!configCacheValue) {
    configCacheValue = (await storage.get<ConfigValues>(CONFIG_KEY)) || {}
  }
  const res = { ...configSetting }
  for (const key in ConfigEnum) {
    res[key].value = configCacheValue[key] || configSetting[key].value
  }
  return res
}
getConfigs()

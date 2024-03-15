import { Storage } from "@plasmohq/storage"

export const CONFIG_KEY = "read-config"

// options setting with default value
export enum ConfigEnum {
  updateOnlyOpenByPlugin = "updateOnlyOpenByPlugin",
  showFloatingButton = "showFloatingButton",
  floatingButtonThreshold = "floatingButtonThreshold"
}

const configSetting = {
  [ConfigEnum.updateOnlyOpenByPlugin]: {
    value: true,
    title: "update progress only open page by plugin" as const,
    describe: ""
  },
  [ConfigEnum.showFloatingButton]: {
    value: true,
    title: "show floating button" as const,
    describe: ""
  },
  [ConfigEnum.floatingButtonThreshold]: {
    value: 95,
    title: "floating button threshold (%)" as const,
    describe: "scroll threshold to show floating button"
  }
}
export type ConfigSettings = typeof configSetting
export type ConfigValues = { [key in ConfigEnum]: ConfigSettings[key]["value"] }
const storage = new Storage()

export async function getConfigValue<T extends ConfigEnum>(key: T): Promise<ConfigSettings[T]["value"]> {
  const configs = await getConfigs()
  const value = configs[key].value || configSetting[key].value
  return value
}

export async function setConfigValue<T extends ConfigEnum>(key: T, value: ConfigSettings[T]["value"]) {
  const configValues = ((await storage.get(CONFIG_KEY)) || {}) as ConfigValues
  configValues[key] = value as any
  storage.set(CONFIG_KEY, configValues)
}

export async function getConfigs() {
  const configValues = (await storage.get<ConfigValues>(CONFIG_KEY)) || {}
  const res = { ...configSetting }
  for (const key in ConfigEnum) {
    res[key].value = configValues[key] ?? configSetting[key].value
  }
  return res
}
getConfigs()

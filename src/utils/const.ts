export const LIST_KEY = "read-list"

export const CONFIG_KEY = "read-config"

// options setting with default value
export enum ConfigEnum {
  updateOnlyOpenByPlugin = "updateOnlyOpenByPlugin"
}

export const configSetting = {
  [ConfigEnum.updateOnlyOpenByPlugin]: true
}

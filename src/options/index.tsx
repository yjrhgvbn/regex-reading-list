import "./index.css"

import { useStorage } from "@plasmohq/storage/hook"

import { CONFIG_KEY, ConfigEnum, configSetting } from "~utils/const"

const tips: Record<ConfigEnum, { title: string; describe?: string }> = {
  updateOnlyOpenByPlugin: {
    title: "update progress only open page by plugin"
    // describe: "仅在插件打开时更新，关闭插件时不更新"
  }
}
function IndexOptions() {
  const [config, setConfig] = useStorage<typeof configSetting>(CONFIG_KEY, (v) => ({ ...configSetting, ...v }))

  function updateConfig(key: keyof typeof config, value: boolean) {
    setConfig({ ...config, [key]: value })
  }

  return (
    <div className="mx-auto pt-10  max-w-[600px]">
      <div className="text-3xl font-bold border-b text-red-600">Settting</div>

      {Object.entries(config).map(([key, value]) => {
        const tip = tips[key as ConfigEnum]
        return (
          <div className="flex pt-2" key={key}>
            <div className="flex items-center h-5">
              <input
                id="helper-checkbox"
                aria-describedby="helper-checkbox-text"
                type="checkbox"
                checked={value}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded "
                onChange={(e) => {
                  updateConfig(key as ConfigEnum, e.target.checked)
                }}
              />
            </div>
            <div className="ms-2 text-sm">
              <label htmlFor="helper-checkbox" className="font-medium text-gray-900 dark:text-gray-300">
                {tip.title}
              </label>
              {tip.describe && (
                <p id="helper-checkbox-text" className="text-xs font-normal text-gray-500 dark:text-gray-300">
                  {tip.describe}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default IndexOptions

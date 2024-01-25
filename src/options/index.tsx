import "./index.css"

import { useStorage } from "@plasmohq/storage/hook"

import { CONFIG_KEY } from "~utils/const"

const defaultConfig = {
  updateOnlyOpenByPlugin: true
}
const tips: Record<keyof typeof defaultConfig, { title: string; describe?: string }> = {
  updateOnlyOpenByPlugin: {
    title: "update progress only open page by plugin"
    // describe: "仅在插件打开时更新，关闭插件时不更新"
  }
}
function IndexOptions() {
  const [config, setConfig] = useStorage<typeof defaultConfig>(CONFIG_KEY, (v) => ({ ...defaultConfig, ...v }))

  function updateConfig(key: keyof typeof config, value: boolean) {
    setConfig({ ...config, [key]: value })
  }

  return (
    <div>
      {Object.entries(config).map(([key, value]: [keyof typeof tips, boolean]) => {
        const tip = tips[key]
        return (
          <div className="flex">
            <div className="flex items-center h-5">
              <input
                id="helper-checkbox"
                aria-describedby="helper-checkbox-text"
                type="checkbox"
                checked={value}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded "
                onChange={(e) => {
                  updateConfig(key, e.target.checked)
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

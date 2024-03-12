import "./index.css"

import { useEffect, useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { ConfigEnum, getConfigs, setConfigValue, type ConfigSettings } from "~utils/config"

function IndexOptions() {
  const [configs, setConfig] = useState<ConfigSettings>()

  useEffect(() => {
    getConfigs().then((res) => {
      setConfig(res)
    })
  })

  function updateConfig(key: ConfigEnum, value: boolean) {
    setConfigValue(key, value)
  }

  return (
    <div className="mx-auto pt-10  max-w-[600px]">
      <div className="text-3xl font-bold border-b text-red-600">Settting</div>

      {Object.entries(configs).map(([key, config]) => {
        const { title, value, describe } = config
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
                {title}
              </label>
              {describe && (
                <p id="helper-checkbox-text" className="text-xs font-normal text-gray-500 dark:text-gray-300">
                  {describe}
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

import "./index.css"

import { useEffect, useState } from "react"

import { ConfigEnum, getConfigs, setConfigValue, type ConfigSettings } from "~utils/config"

function IndexOptions() {
  const [configs, setConfig] = useState<ConfigSettings>()

  useEffect(() => {
    getConfigs().then((res) => {
      setConfig(res)
    })
  }, [])

  function updateConfig(key: ConfigEnum, value: boolean | number) {
    setConfigValue(key, value).then(() =>
      getConfigs().then((res) => {
        setConfig(res)
      })
    )
  }

  function renderCheckbox(key: ConfigEnum, config: ConfigSettings[ConfigEnum]) {
    const { title, value, describe } = config
    return (
      <div className="flex pt-2" key={key}>
        <div className="flex items-center h-5">
          <input
            id={key}
            aria-describedby={title}
            type="checkbox"
            checked={value as boolean}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded "
            onChange={(e) => {
              updateConfig(key, e.target.checked)
            }}
          />
        </div>
        <div className="ms-2 text-sm">
          <label htmlFor={key} className="font-medium text-gray-900 dark:text-gray-300">
            {title}
          </label>
          {describe && <p className="text-xs font-normal text-gray-500 dark:text-gray-300">{describe}</p>}
        </div>
      </div>
    )
  }

  function renderNumberInput(key: ConfigEnum, config: ConfigSettings[ConfigEnum]) {
    const { title, value, describe } = config
    return (
      <div className=" pt-2" key={key}>
        <div className="flex h-5">
          <span className="font-medium text-gray-900 dark:text-gray-300 mr-2 text-sm">{title}:</span>
          <div>
            <div className="ms-2 text-sm">
              <input
                id={key}
                aria-describedby={title}
                type="number"
                value={value as number}
                className="bg-gray-100 border-gray-300 rounded "
                onChange={(e) => {
                  updateConfig(key, Number(e.target.value))
                }}
              />
              {describe && <p className="text-xs font-normal text-gray-500 dark:text-gray-300">{describe}</p>}
            </div>
          </div>
        </div>
        {/* 
          <label htmlFor={key} className="font-medium text-gray-900 dark:text-gray-300">
            
          </label>
         
        </div> */}
      </div>
    )
  }

  return (
    <div className="mx-auto pt-10  max-w-[600px]">
      <div className="text-3xl font-bold border-b text-red-600">Settting</div>

      {configs &&
        Object.entries(configs).map(([key, config]) => {
          const { title, value, describe } = config
          if (typeof value === "boolean") {
            return renderCheckbox(key as ConfigEnum, config as ConfigSettings[ConfigEnum])
          } else if (typeof value === "number") {
            return renderNumberInput(key as ConfigEnum, config as ConfigSettings[ConfigEnum])
          }
          return null
        })}
    </div>
  )
}

export default IndexOptions

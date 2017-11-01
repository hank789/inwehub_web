/**
 * 选择日期时间
 * @param options
 * @param callback
 */
function selectTime (options, callback) {
  let picker = new window.mui.DtPicker(options)

  picker.show((rs) => {
    callback(rs.text)
    picker.dispose()
  })
}

/**
 * 选择key:value
 * @param defaultValue
 * @param options
 * @param callback (value, key)
 */
// 调用系统的选择框；
function selectKeyValue (defaultValue, options, callback) {
  var Picker = new window.mui.PopPicker()
  Picker.setData(options)

  if (defaultValue) {
    Picker.pickers[0].setSelectedValue(defaultValue)
  }

  Picker.show(items => {
    callback(items[0].value, items[0].text)
    Picker.dispose()
  })
}

function selectCityThreeLevel (defaultValues, data, callback) {
  var cityPicker = new window.mui.PopPicker({
    layer: 3
  })

  cityPicker.setData(data)

  if (defaultValues) {
    cityPicker.pickers[0].setSelectedValue(defaultValues[0], 0, () => {
      cityPicker.pickers[1].setSelectedValue(defaultValues[1], 0, () => {
        cityPicker.pickers[2].setSelectedValue(defaultValues[2], 0, () => {
        })
      })
    })
  }

  cityPicker.show(items => {
    callback(items)
    cityPicker.dispose()
  })
}

export {
  selectTime,
  selectKeyValue,
  selectCityThreeLevel
}

import { Streamlit, ArrowTable } from "streamlit-component-lib"
import { useRenderData } from "streamlit-component-lib-react-hooks"
import React, { useState, useCallback, Fragment } from "react"
import { MRT_ColumnDef, MaterialReactTable } from "material-react-table"

/**
 * This is a React-based component template with functional component and hooks.
 */
const CustomTable: React.VFC = () => {
  // "useRenderData" returns the renderData passed from Python.
  const renderData = useRenderData()

  const [numClicks, setNumClicks] = useState(0)
  const [isFocused, setIsFocused] = useState(false)

  /** Click handler for our "Click Me!" button. */
  const onClicked = useCallback(() => {
    // Increment `numClicks` state, and pass the new value back to
    // Streamlit via `Streamlit.setComponentValue`.
    const newValue = numClicks + 1
    setNumClicks(newValue)
    Streamlit.setComponentValue(newValue)
  }, [numClicks])

  /** Focus handler for our "Click Me!" button. */
  const onFocus = useCallback(() => {
    setIsFocused(true)
  }, [])

  /** Blur handler for our "Click Me!" button. */
  const onBlur = useCallback(() => {
    setIsFocused(false)
  }, [])

  // Arguments that are passed to the plugin in Python are accessible
  // via `renderData.args`. Here, we access the "name" arg.
  const name = renderData.args["name"]
  const data = renderData.args["data"]

  // Streamlit sends us a theme object via renderData that we can use to ensure
  // that our component has visuals that match the active theme in a
  // streamlit app.
  const theme = renderData.theme
  const style: React.CSSProperties = {}

  // Maintain compatibility with older versions of Streamlit that don't send
  // a theme object.
  if (theme) {
    // Use the theme object to style our button border. Alternatively, the
    // theme style is defined in CSS vars.
    const borderStyling = `1px solid ${isFocused ? theme.primaryColor : "gray"}`
    style.border = borderStyling
    style.outline = borderStyling
  }

  const tableColumns = (table: ArrowTable): MRT_ColumnDef<any>[] => {
    const headers = table.columnTable.toArray()
    const tableColumns: any[] = []

    for (let i = 0; i < headers.length; i++) {
      var header: { [key: string]: any } = {}
      const name = headers[i][0].toString();
      header['header'] = name
      header['accessorKey'] = name
      tableColumns.push(header)
      
    }
    return tableColumns
}


const tableData = (table: ArrowTable): any[] => {
  const colsNum = table.columns
  const rowsNum = table.rows

  const headers = table.columnTable.toArray()
  const tableData = []
  for (let i = 1; i < rowsNum; i++) {
    var row: { [key: string]: any } = {}
    for (let j = 1; j < colsNum; j++) {
      const element = table.getCell(i, j).content?.toString()
      const header = headers[j-1][0].toString()
      if (header != undefined)
        row[header] = element
    }
    tableData.push(row)
  }

  return tableData
}

  // Show a button and some text.
  // When the button is clicked, we'll increment our "numClicks" state
  // variable, and send its new value back to Streamlit, where it'll
  // be available to the Python program.
  return (
    <Fragment>
      <MaterialReactTable
          columns={tableColumns(data)}
          data={tableData(data)}
          enableRowSelection={true}
        />
       <span>
        Hello, {name}! &nbsp;
        <button
          style={style}
          onClick={onClicked}
          disabled={renderData.disabled}
          onFocus={onFocus}
          onBlur={onBlur}
        >
          Click Me!
      </button>
    </span>
    </Fragment>
  )
}

export default CustomTable

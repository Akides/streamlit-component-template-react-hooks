import React from "react"
import ReactDOM from "react-dom"
import { StreamlitProvider } from "streamlit-component-lib-react-hooks"
import CustomTable from "./CustomTable"

ReactDOM.render(
  <React.StrictMode>
    <StreamlitProvider>
      <CustomTable />
    </StreamlitProvider>
  </React.StrictMode>,
  document.getElementById("root")
)

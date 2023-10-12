import React from 'react'
import {ConfigProvider} from 'antd'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import "antd/dist/reset.css"
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
   <ConfigProvider theme={{
    token : {
      colorPrimary : "#2123bf",
      colorError : "#bf2517",

    }
   }}>
       <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools />
    </QueryClientProvider>
   </ConfigProvider>
  </React.StrictMode>,
)

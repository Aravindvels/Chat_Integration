import React, { Suspense } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./route/routes";
import { SnackbarProvider } from "notistack";

function App() {  
  return (
    <SnackbarProvider
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      autoHideDuration={5000}
    >
      <Suspense>
        <Router>
          <Routes />
        </Router>
      </Suspense>
    </SnackbarProvider>
  );
}

export default App;

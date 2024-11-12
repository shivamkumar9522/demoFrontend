import "bootstrap/dist/css/bootstrap.min.css";
import Crude from "./Component/Employee";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Edit from "./Component/EditEmployee";
import AddForm from "./Component/AddEmployee";


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Crude />} />
          <Route path="edit/:id" element={<Edit />} />
          <Route path="/form" element={<AddForm />} />
        
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

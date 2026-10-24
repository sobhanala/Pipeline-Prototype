import UseCases from "./layout/main/use-cases/UseCases";
import Header from "./layout/header/Header";
import Footer from "./layout/footer/Footer";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Pipeline from "./layout/main/pipeline/Pipeline";
import {ToastContainer} from "react-toastify";

function App() {
  return (
    <>
        <ToastContainer/>
        <Header />
        <BrowserRouter>
        <Routes>
          <Route path="use-cases" element={<UseCases />} />
          <Route path="pipeline" element={<Pipeline />} />
        </Routes>
        </BrowserRouter>
        <Footer />
    </>
  );
}

export default App;

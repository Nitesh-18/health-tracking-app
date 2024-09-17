import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import AddHealthRecord from "./components/AddHealthRecord";
import RecordModal from "./components/RecordModal";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add" element={<AddHealthRecord />} />
        <Route path="/record/:id" element={<RecordModal />} />
      </Routes>
    </Router>
  );
}

export default App;

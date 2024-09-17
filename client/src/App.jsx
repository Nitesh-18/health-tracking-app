import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import AddHealthRecord from "./components/AddHealthRecord";
import RecordDetail from "./components/RecordModal";
import EditHealthRecord from "./components/EditHealthRecord";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add" element={<AddHealthRecord />} />
        <Route path="/record/:id" element={<RecordDetail />} />
        <Route path="/edit/:id" element={<EditHealthRecord />} />
      </Routes>
    </Router>
  );
}

export default App;

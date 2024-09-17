import { useState } from "react";
import "./index.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1 className="text-4xl bg-red-500"> Hey</h1>
      <button className="bg-blue-500" onClick={() => setCount(count + 1)}>
        Count {count}
      </button>
    </div>
  );
}

export default App;

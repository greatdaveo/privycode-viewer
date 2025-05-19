import "./App.css";
import { ViewerPage } from "./pages/ViewerPage";

function App() {
  const token = new URLSearchParams(window.location.search).get("token") || "";
  // console.log(token);
  return (
    <div>
      <h1>Testing My Repo</h1>
      <ViewerPage token={token} />
    </div>
  );
}

export default App;

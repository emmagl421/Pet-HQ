//Example code 

import { Button } from "./components/Button";

export default function App() {
  return (
    <div>
      <h1>My App</h1>
      <Button label="Say hi" onClick={() => alert("Hi!")} />
    </div>
  );
}
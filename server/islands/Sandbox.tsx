import { useState } from "preact/hooks";
import { Button } from "../components/Button.tsx";

async function login() {
  const username = window.prompt("Username", "test@test.com");
  const password = window.prompt("Password", "12345678");
  try {
    const response = await fetch("/api/v1/authentication", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    return await response.json();
  } catch (e) {
    window.alert("invalid credentials!");
  }
}

async function logout() {
  await fetch("/api/v1/authentication", {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  window.alert("should be logged out now");
}

interface Props {
  token?: string;
  output?: string;
}

export default function Sandbox(props: Props = {}) {
  const [token, setToken] = useState(props.token);
  const [output, setOutput] = useState(props.output);
  return (
    <div class="flex flex-col h-screen v-screen items-center justify-center">
      <div class="flex w-2/3">
        <Button
          onClick={async () => {
            const auth = await login();
            setOutput(JSON.stringify(auth, null, 2));
            setToken(auth?.token);
          }}
        >
          Login
        </Button>
        <Button onClick={logout}>Logout</Button>
      </div>
      <div class="flex w-2/3">
        <Button
          onClick={async () => {
            const res = await fetch("/api/v1/warehouses", {
              credentials: "include",
            });
            const warehouses = await res.json();
            setOutput(JSON.stringify(warehouses, null, 2));
          }}
        >
          /api/v1/warehouses
        </Button>
      </div>
      <pre class="bg-purple-200 w-2/3 h-96 overflow-auto">{output}</pre>
    </div>
  );
}

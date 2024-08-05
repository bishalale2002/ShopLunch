import React from "react";
import Layouts from "./../components/layout/Layouts";
import { useAuth } from "../components/context/auth";
export default function HomePage() {
  const [auth] = useAuth();
  return (
    <Layouts title={"Home Page"}>
      <h1>Home Pages </h1>
      <pre>{JSON.stringify(auth, null, 4)}</pre>
    </Layouts>
  );
}

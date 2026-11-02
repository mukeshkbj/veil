import { Suspense } from "react";
import { Lab } from "./lab";

export const metadata = { title: "Sample tests · Veil" };

export default function LabPage() {
  return (
    <Suspense>
      <Lab />
    </Suspense>
  );
}

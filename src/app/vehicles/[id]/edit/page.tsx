"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function TestEditPage() {
  const params = useParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    console.log("TEST PAGE LOADED");
    console.log("Params:", params);
    
    const id = params?.id;
    if (id) {
      console.log("Vehicle ID:", id);
      
      fetch(`/api/vehicles/${id}`)
        .then(res => {
          console.log("API Response Status:", res.status);
          return res.json();
        })
        .then(data => {
          console.log("API Data:", data);
          setData(data);
        })
        .catch(err => {
          console.log("API Error:", err);
        });
    }
  }, [params]);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>TEST EDIT PAGE</h1>
      <p>Vehicle ID: {params?.id}</p>
      <p>Data: {data ? JSON.stringify(data, null, 2) : "Loading..."}</p>
    </div>
  );
}

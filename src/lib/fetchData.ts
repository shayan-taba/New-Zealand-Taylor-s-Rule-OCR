// lib/fetchData.ts
export async function fetchData() {
    try {
      const response = await fetch("/api/getData");
      console.log(response)
      if (!response.ok) throw new Error("Failed to fetch data");
  
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error("Fetch error:", error);
      return [];
    }
  }
  
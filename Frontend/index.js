import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const backendUrl = import.meta.env.VITE_BACKEND_URL || "/api";

document.addEventListener("DOMContentLoaded", async function () {
  const submit = document.getElementById("submit");
  const filter = document.getElementById("categoryFilter");
  const itemDiv = document.getElementById("item");
  const items = document.createElement("h1");
  const next = document.createElement("button");
  const prev=document.createElement("button");
  prev.id="prev";
  prev.textContent="Previous";
  next.id = "next";
  next.textContent = "Next";
  const supabase = createClient(supabaseUrl, supabaseKey);
  let page = 1;
  const batchSize = 100;
  let currentFilter = "";
  let itemListData = [];

  const renderPage = () => {
    const pageItems = itemListData.slice((page - 1) * batchSize, page * batchSize);
    const result = pageItems.map((item) => `<h2>${item.name}</h2><p>Price: ${item.price}</p>`).join(" ");

    itemDiv.innerHTML = result;
    itemDiv.appendChild(next);
    itemDiv.appendChild(prev);
  };

  supabase
    .channel("items")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "items"
      },
      (payload) => {
        const newItem = payload.new;

        if (!newItem || newItem.category !== currentFilter) {
          return;
        }

        itemListData = [newItem,...itemListData];
        console.log("New item added:", newItem);
        console.log("Updated item list:", itemListData);
      }
    )
    .subscribe();

  items.textContent = "Select a category and click submit to fetch items.";
  itemDiv.appendChild(items);
  prev.addEventListener("click", () => {
    try {
      if (page === 1) {
        return;
      }
      page -= 1;
      renderPage();
    } catch (error) {
      items.textContent = "Error fetching items.";
      itemDiv.appendChild(items);
    }
  });
  next.addEventListener("click", () => {
    try {
      if (page * batchSize >= itemListData.length) {
        return;
      }

      page += 1;
      renderPage();
    } catch (error) {
      items.textContent = "Error fetching items.";
      itemDiv.appendChild(items);
    }
  });

  submit.addEventListener("click", async () => {
    try {
      currentFilter = filter.value;
      page = 1;

      const response = await fetch(`${backendUrl}/${currentFilter}`);
      itemListData = await response.json();
      items.textContent = "Loading";
      renderPage();
    } catch (error) {
      items.textContent = "Error fetching items.";
      itemDiv.appendChild(items);
    }
  });
});

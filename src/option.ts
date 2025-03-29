document.addEventListener("DOMContentLoaded", () => {
  // Helper function to get element by id with type
  const getElement = <T extends HTMLElement>(id: string): T => {
    const el = document.getElementById(id);
    if (!el) throw new Error(`Element with id "${id}" not found.`);
    return el as T;
  };

  // Retrieve stored settings and apply defaults if values are missing
  chrome.storage.sync.get(["batchSize", "batchDelay", "scanTime"], (result) => {
    const batchSizeInput = getElement<HTMLInputElement>("batch-size");
    const batchDelayInput = getElement<HTMLInputElement>("batch-delay");
    const scanTimeInput = getElement<HTMLInputElement>("scan-time");

    batchSizeInput.value = result.batchSize?.toString() || "5";
    batchDelayInput.value = result.batchDelay?.toString() || "5";
    scanTimeInput.value = result.scanTime?.toString() || "20";
  });

  // Handle form submission to save updated settings
  const optionsForm = getElement<HTMLFormElement>("optionsForm");
  optionsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const batchSize = Number(getElement<HTMLInputElement>("batch-size").value);
    const batchDelay = Number(
      getElement<HTMLInputElement>("batch-delay").value
    );
    const scanTime = Number(getElement<HTMLInputElement>("scan-time").value);

    chrome.storage.sync.set({ batchSize, batchDelay, scanTime }, () => {
      console.log("Settings saved");

      alert("Einstellungen gespeichert");
    });
  });
});

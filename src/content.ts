import JSZip from "jszip";

/**
 * Get the stored settings from storage
 */
function getSettings(): Promise<{
  batchSize: number;
  batchDelay: number;
  scanTime: number;
}> {
  return new Promise((resolve) => {
    interface StorageResult {
      batchSize?: number;
      batchDelay?: number;
      scanTime?: number;
    }

    chrome.storage.sync.get(
      ["batchSize", "batchDelay", "scanTime"],
      (result: StorageResult) => {
        const batchSize: number = result.batchSize || 5; // Default to 5 if not set
        const batchDelay: number = result.batchDelay || 5; // Default to 5 seconds if not set
        const scanTime: number = result.scanTime || 20; // Default to 20 seconds if not set
        resolve({ batchSize, batchDelay, scanTime });
      }
    );
  });
}

/**
 * Injects a download button into the UI
 */
(() => {
  function injectDownloadButton(): void {
    // Inject after h3 with data-testid="folder-title" or data-testid="file-title"
    const targetDiv = document.querySelector("h1#page-title");
    if (!targetDiv) {
      console.error("Target container not found");
      return;
    } // Exit if the container is not found
    const button = document.createElement("button");
    button.id = "downloadAllButton";
    button.setAttribute("data-testid", "download-all-btn");
    button.className = "btn btn-secondary d-flex align-items-center";
    button.style.marginRight = "10px";
    button.style.padding = "10px 15px";
    button.style.fontSize = "16px";
    button.style.fontWeight = "bold";
    button.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
    button.style.transition = "transform 0.2s, box-shadow 0.2s";
    button.innerHTML = `
      <img src="${chrome.runtime.getURL(
        "logo.png"
      )}" alt="Logo" style="width: 20px; height: 20px; margin-right: 10px;">
      Down-Cloud
    `;
    // Attach click event listener to trigger the main function
    button.addEventListener("click", () => {
      main();
    });
    // Inject the button into the target container
    targetDiv.insertBefore(button, targetDiv.firstChild);
  }

  // Ensure the button is injected once the DOM is fully loaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectDownloadButton);
  } else {
    // If the DOM is already loaded, inject the button immediately
    injectDownloadButton();
  }
})();

/**
 * Show overlay dialog while downloading
 */
async function showOverlay(): Promise<void> {
  const overlay = document.createElement("div");
  overlay.innerHTML = `
  <div class="modal fade edit-modal in" tabindex="-1" role="dialog" style="display: block;">
    <div class="modal-dialog" role="document">
      <div class="modal-content" data-testid="modal_content">
        <div class="modal-header">
          <h1 class="h4 modal-title" data-testid="popup-title">Download auswählen</h1>
          <span>
            Klicken Sie auf einen Ordner oder eine Datei, um deren Inhalte herunterzuladen. Ordner inklusive Unterordner und Dateien werden in Chargen (${
              (await getSettings()).batchSize
            } Dateien alle ${
    (await getSettings()).batchDelay
  } Sekunden) heruntergeladen. Nach ${
    (await getSettings()).scanTime
  } Sekunden wird die Suche nach Unterordnern beendet. Wenn Sie möchten, können Sie die leere 
          </span>
          <a href="#" id="downloadZip">Ordnerstruktur als ZIP herunterladen</a>
          <span>, um sie manuell wiederzuverwenden.</span>
          <br/>
          <span id="status">
            <span id="status-text">Vorbereiten</span>
            <i class="fa fa-spinner fa-spin"></i>
          </span>
        </div>
        <p/>
        <div style="max-height: 300px; overflow-y: auto;">
          <ul id="file-tree">
          </ul>
        </div>
        <p/>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">Abschließen</span>
          </button>
        </div>
      </div>
    </div>
  </div>
  `;
  document.body.appendChild(overlay);

  const downloadZipButton = overlay.querySelector("#downloadZip");
  if (downloadZipButton) {
    downloadZipButton.addEventListener("click", () => {
      downloadZipFile();
    });
  }

  const closeButton = overlay.querySelector(".btn-secondary");
  if (closeButton) {
    closeButton.addEventListener("click", () => {
      overlay.remove();

      // Clear all storage data
      chrome.storage.local.clear(() => {
        console.log("Storage cleared");
      });

      // Close the window
      chrome.runtime.sendMessage(
        { action: "close_window" },
        (response: any) => {
          console.log("Tab closed:", response);
        }
      );

      // Remove the overlay
      const overlayElement = document.querySelector(".modal");
      if (overlayElement) {
        overlayElement.remove();
      }

      // Reload the page
      window.location.reload();
    });
  }

  // Update file tree and make every node clickable, stop update after scanTime sec.
  const fileTree = document.getElementById("file-tree");
  const nodeMap: { [key: string]: TreeNode } = {};

  const createListItem = (node: TreeNode): string => {
    nodeMap[node.id || "root"] = node;
    return `<li class="${node.type}_structure">
      <a href="#" class="download-node" data-nodeid="${node.id || "root"}">${
      node.name === "root" ? "Alles" : node.name || "Unnamed"
    }</a>
      <ul>${
        node.children
          ? node.children.map((child) => createListItem(child)).join("")
          : ""
      }</ul>
    </li>`;
  };

  const updateTree = () => {
    getTreeFromStorage("root").then((tree) => {
      if (fileTree) {
        const treeHtml = createListItem(tree);
        fileTree.innerHTML = treeHtml;
        document.querySelectorAll(".download-node").forEach((elem) => {
          elem.addEventListener("click", (event) => {
            event.preventDefault();
            const nodeId = (elem as HTMLElement).getAttribute("data-nodeid");
            if (nodeId && nodeMap[nodeId]) {
              downloadNode(nodeMap[nodeId]);
            }
          });
        });
      }
    });
  };

  const treeInterval = setInterval(updateTree, 500);
  setTimeout(() => {
    clearInterval(treeInterval);
  }, (await getSettings()).scanTime * 1000);

  let secondsRemaining = (await getSettings()).scanTime;
  const interval = setInterval(() => {
    secondsRemaining -= 1;
    if (secondsRemaining <= 0) {
      clearInterval(interval);

      // Get the number of files in the file tree
      const fileCount = Object.keys(nodeMap).length;

      const statusText = document.getElementById("status-text");
      if (statusText) {
        statusText.innerHTML = `Laden beendet. ${fileCount} Dateien gefunden.`;
      }
      const spinner = document.querySelector(".fa-spinner");
      if (spinner) {
        // Remove the spinner
        spinner.remove();
      }
    } else {
      const statusText = document.getElementById("status-text");
      if (statusText) {
        statusText.innerHTML = `Laden... (${secondsRemaining} Sekunden verbleibend)`;
      }
    }
  }, 1000);
}

// New function to download a node (folder or file) in batches.
async function downloadNode(node: TreeNode): Promise<void> {
  // Helper sleep function.
  function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  // Recursively extract file nodes from the given node.
  function extractFiles(node: TreeNode): TreeNode[] {
    let files: TreeNode[] = [];
    if (node.type === "file") {
      files.push(node);
    }
    if (node.children) {
      node.children.forEach((child) => {
        files = files.concat(extractFiles(child));
      });
    }
    return files;
  }
  const files = extractFiles(node);
  (async () => {
    const settings = await getSettings();
    for (let i = 0; i < files.length; i += settings.batchSize) {
      const batch = files.slice(i, i + settings.batchSize);
      batch.forEach((file) => {
        const fileUrl = `https://brandenburg.cloud/files/file?download=true&file=${file.id}`;
        downloadFile(fileUrl);
      });
      if (i + settings.batchSize < files.length) {
        await sleep(settings.batchDelay * 1000);
      }
    }
  })();
}

/**
 * Main function to initiate file extraction
 */
function main(): void {
  // Clear all storage data
  chrome.storage.local.clear(() => {
    console.log("Storage cleared");
  });

  chrome.runtime.sendMessage({ action: "open_tab", url: "about:blank" }); // Open a new tab
  const fileList = extractFileList(); // Retrieve file and folder structure
  console.log(fileList); // Log the extracted file list

  // Show the overlay dialog
  showOverlay();

  setTimeout(() => {
    // Open a new tab for every directory
    fileList.directories.forEach((directory) => {
      const newTabUrl = directory.url + "?down-cloud=true"; // Append the query parameter
      chrome.runtime.sendMessage({ action: "open_tab", url: newTabUrl });
    });

    chrome.storage.local.set({ root: fileList });
  }, 1000); // Delay to ensure the new tab is opened
}

/**
 * Remote function to extract files in another tab (if needed)
 */
function remote(): void {
  const fileList = extractFileList();

  // Get the current URL
  const currentUrl = window.location.href;
  const urlParts = currentUrl.split("/");

  // Get the last part of the URL
  const lastPart = urlParts[urlParts.length - 1];
  const lastPartId = lastPart.split("?")[0]; // Remove any query parameters

  fileList.directories.forEach((directory) => {
    const newTabUrl = directory.url + "?down-cloud=true"; // Append the query parameter
    chrome.runtime.sendMessage({ action: "open_tab", url: newTabUrl });
  });

  // Save the extracted data to extension storage
  chrome.storage.local.set({ [lastPartId]: fileList }, () => {
    console.log("File list saved to storage:", fileList);
  });
}

declare const chrome: any;

/**
 * Represents a directory structure
 */
interface Directory {
  id: string;
  name: string | undefined;
  url: string;
}

/**
 * Represents a file structure
 */
interface FileItem {
  id: string;
  name: string | undefined;
}

/**
 * Extracts a list of directories and files from the page
 * @returns An object containing directories and files
 */
function extractFileList(): { directories: Directory[]; files: FileItem[] } {
  const directories: Directory[] = [];

  // Find and process all folder elements
  const openFolderButtons = document.querySelectorAll(
    ".directories .openfolder"
  );
  openFolderButtons.forEach((button) => {
    const folderId = button.getAttribute("data-folder-id");
    const folderName = (
      button.querySelector("strong.card-title-directory") as HTMLElement
    )?.innerText;
    if (folderId) {
      // Construct the folder URL by modifying the current URL
      const urlParts = window.location.href.split("/");
      if (urlParts.length > 6) urlParts.pop(); // Remove the last ID if present
      const newUrl = `${urlParts.join("/")}/${folderId}`;

      directories.push({
        id: folderId,
        name: folderName,
        url: newUrl
          .replace(/([^:]\/)\/+/g, "$1")
          .replace("?down-cloud=true", ""),
      });
    }
  });

  const files: FileItem[] = [];

  // Find and process all file elements
  const fileButtons = document.querySelectorAll(".files .file");
  fileButtons.forEach((button) => {
    const fileId = button.getAttribute("data-file-id");
    const fileName = (button.querySelector("a.title") as HTMLElement)
      ?.innerText;
    if (fileId) {
      files.push({ id: fileId, name: fileName });
    }
  });

  // Return structured file and folder data
  return { directories, files };
}

interface TreeNode {
  type: "root" | "folder" | "file";
  name?: string;
  id?: string;
  children?: TreeNode[];
}

async function getTreeFromStorage(rootId: string): Promise<TreeNode> {
  const getNode = (
    id: string
  ): Promise<{ directories: Directory[]; files: FileItem[] }> => {
    return new Promise((resolve) => {
      interface StorageFetchResult {
        directories: Directory[];
        files: FileItem[];
      }
      chrome.storage.local.get(
        id,
        (result: { [key: string]: StorageFetchResult }) => {
          resolve(
            result[id] || ({ directories: [], files: [] } as StorageFetchResult)
          );
        }
      );
    });
  };

  async function buildTree(
    id: string,
    name: string | undefined,
    type: "root" | "folder"
  ): Promise<TreeNode> {
    const { directories, files } = await getNode(id);
    const children: TreeNode[] = [];

    for (const dir of directories) {
      children.push(await buildTree(dir.id, dir.name, "folder"));
    }

    for (const file of files) {
      children.push({
        type: "file",
        id: file.id,
        name: file.name,
      });
    }

    return { type, id, name, children };
  }

  return buildTree(rootId, "root", "root");
}

/**
 * Checks if the script should run in "down-cloud" mode for remote extraction
 */
(() => {
  if (window.location.href.includes("down-cloud=true")) {
    remote();
  }
})();

async function downloadFile(url: string): Promise<void> {
  chrome.runtime.sendMessage({
    action: "open_tab",
    url: url,
  });
}

/**
 * Downloads a ZIP file containing only the folder structure without all files
 */
async function downloadZipFile(): Promise<void> {
  getTreeFromStorage("root").then((tree) => {
    console.log("Tree structure:", tree);

    const zip = new JSZip();
    const folderName = "Root";
    const folder = zip.folder(folderName);

    function addFolderToZip(node: TreeNode, parentFolder: JSZip): void {
      if (node.type === "folder") {
        const currentFolder = parentFolder.folder(
          node.name || "Unnamed Folder"
        );
        if (currentFolder) {
          node.children?.forEach((child) =>
            addFolderToZip(child, currentFolder)
          );
        }
      } else if (node.type === "file") {
        parentFolder.file(node.name || "Unnamed File", "");
      }
    }

    tree.children?.forEach((node) => {
      addFolderToZip(node, folder!);
    });

    zip.generateAsync({ type: "blob" }).then((content) => {
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${folderName}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  });
}

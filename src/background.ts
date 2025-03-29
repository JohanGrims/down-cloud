// Define types for the message
type Message = {
  action: "open_tab" | "close_window";
  url?: string;
};

let newWindowId: number | null = null;

chrome.windows.onRemoved.addListener((windowId) => {
  if (windowId === newWindowId) {
    newWindowId = null;
  }
});

chrome.runtime.onMessage.addListener(
  (message: Message, sender: any, sendResponse: any) => {
    if (message.action === "open_tab") {
      if (newWindowId === null) {
        chrome.windows.create(
          {
            url: message.url,
            focused: false, // Opens the window in the background
          },
          (newWindow) => {
            newWindowId = newWindow?.id || null;
          }
        );
      } else {
        chrome.tabs.create({
          windowId: newWindowId,
          url: message.url,
          active: false, // Opens the tab in the background
        });
      }
    }

    if (message.action === "close_window") {
      if (newWindowId !== null) {
        chrome.windows.remove(newWindowId, () => {
          newWindowId = null;
        });
      }
    }

    return true;
  }
);

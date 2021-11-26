import {
  copyFolder as doCopyFolder,
  cloneFolder as doCloneFolder,
} from "./copyFolder";

type Spreadsheet = GoogleAppsScript.Spreadsheet.Spreadsheet;

export function copyFolder(src: string, dist: string) {
  doCopyFolder(src, dist);
}

const showIdInputDialog = (initialId = "") => {
  const template = HtmlService.createTemplateFromFile("dialog");
  template.initialId = initialId;
  const html = template.evaluate();
  SpreadsheetApp.getUi().showModalDialog(html, "コピー元とコピー先を選択");
};

const getFolderId = () => {
  const spreadsheetId = SpreadsheetApp.getActiveSpreadsheet().getId();
  return DriveApp.getFileById(spreadsheetId).getParents().next().getId();
};

export function copyFolderByDialog() {
  showIdInputDialog(getFolderId());
}

export function cloneFolder() {
  doCloneFolder(getFolderId());
}

type SubMenu = { name: string; functionName: string }[];
export function onOpen() {
  const menu: SubMenu = [
    { name: "フォルダーコピー", functionName: "copyFolderByDialog" },
    { name: "フォルダー複製", functionName: "cloneFolder" },
  ];
  SpreadsheetApp.getActiveSpreadsheet().addMenu("フォルダー操作", menu);
}

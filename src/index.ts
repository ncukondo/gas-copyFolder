import {
  copyFolder as doCopyFolder,
  cloneFolder as doCloneFolder,
} from "./copyFolder";

type Spreadsheet = GoogleAppsScript.Spreadsheet.Spreadsheet;
declare const SpreadsheetApp: GoogleAppsScript.Spreadsheet.SpreadsheetApp;
declare const HtmlService: GoogleAppsScript.HTML.HtmlService;
declare const DriveApp: GoogleAppsScript.Drive.DriveApp;

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

export function onOpen() {
  const menu = [
    { name: "フォルダーコピー", functionName: "copyFolderByDialog" },
    { name: "フォルダー複製", functionName: "cloneFolder" },
  ];
  SpreadsheetApp.getActiveSpreadsheet().addMenu("フォルダー操作", menu);
}

import { copyFolder as doCopyFolder } from "./copyFolder";

type Spreadsheet = GoogleAppsScript.Spreadsheet.Spreadsheet;
declare const SpreadsheetApp: GoogleAppsScript.Spreadsheet.SpreadsheetApp;
declare const HtmlService: GoogleAppsScript.HTML.HtmlService;

export function copyFolder(src: string, dist: string) {
  doCopyFolder(src, dist);
}

const showIdInputDialog = (initialId = "") => {
  const template = HtmlService.createTemplateFromFile("dialog");
  template.initialId = initialId;
  const html = template.evaluate();
  SpreadsheetApp.getUi().showModalDialog(html, "コピー元とコピー先を選択");
};

export function copyFolderByDialog() {
  showIdInputDialog(SpreadsheetApp.getActiveSpreadsheet().getId());
}

export function onOpen() {
  const menu = [
    { name: "フォルダーコピー", functionName: "copyFolderByDialog" },
  ];
  SpreadsheetApp.getActiveSpreadsheet().addMenu("フォルダーコピー", menu);
}

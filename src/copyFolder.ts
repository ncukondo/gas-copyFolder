declare const DriveApp: GoogleAppsScript.Drive.DriveApp;
type File = GoogleAppsScript.Drive.File;
type Folder = GoogleAppsScript.Drive.Folder;

const isShortcut = (f: File | Folder) => (f as any).getTargetId() !== null;

const getShortcutTargetFolder = (f: Folder) =>
  DriveApp.getFolderById((f as any).getTargetId());

const getShortcutTargetFile = (file: File) =>
  DriveApp.getFileById((file as any).getTargetId());

const copyFolder = (src: string, dist: string, folderIds = [] as string[]) => {
  const source = DriveApp.getFolderById(src);
  const targetParent = DriveApp.getFolderById(dist);
  const target = targetParent.createFolder(source.getName());
  const files = source.getFiles();
  while (files.hasNext()) {
    const f = files.next();
    const file = isShortcut(f) ? getShortcutTargetFile(f) : f;
    if (file) file.makeCopy(file.getName(), target);
  }

  const folders = source.getFolders();
  folderIds.push(target.getId());
  while (folders.hasNext()) {
    const f = folders.next();
    const folder = isShortcut(f) ? getShortcutTargetFolder(f) : f;
    const folderId = folder.getId();
    // eslint-disable-next-line no-continue
    if (folderIds.includes(folderId)) continue; // prevent loop by shortcut
    folderIds.push(folderId);
    copyFolder(folderId, target.getId(), folderIds);
  }
};

export { copyFolder };

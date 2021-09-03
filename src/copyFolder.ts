declare const DriveApp: GoogleAppsScript.Drive.DriveApp;
type File = GoogleAppsScript.Drive.File;
type Folder = GoogleAppsScript.Drive.Folder;

const isShortcut = (f: File | Folder) => (f as any).getTargetId() !== null;

const getShortcutTargetFolder = (f: Folder) =>
  DriveApp.getFolderById((f as any).getTargetId());

const getShortcutTargetFile = (file: File) =>
  DriveApp.getFileById((file as any).getTargetId());

const copyFolder = (from: string, to: string, newFolderName = "") => {
  const doCopyFolder = (
    src: string,
    dist: string,
    newFolderTitle: string,
    folderIds: string[]
  ) => {
    const source = DriveApp.getFolderById(src);
    const targetParent = DriveApp.getFolderById(dist);
    const target = targetParent.createFolder(source.getName());
    if (newFolderTitle) target.setName(newFolderTitle);
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
      doCopyFolder(folderId, target.getId(), "", folderIds);
    }
  };
  doCopyFolder(from, to, newFolderName, []);
};

const cloneFolder = (from: string, newFolderName = "") => {
  const source = DriveApp.getFolderById(from);
  const target = source.getParents().next();
  const title = newFolderName || `clone of ${source.getName()}`;
  copyFolder(from, target.getId(), title);
};

export { copyFolder, cloneFolder };

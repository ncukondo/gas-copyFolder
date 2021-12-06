type File = GoogleAppsScript.Drive.File;
type Folder = GoogleAppsScript.Drive.Folder;

const isShortcut = (f: File | Folder) => (f as any).getTargetId() !== null;

const getShortcutTargetFolder = (f: Folder) =>
  DriveApp.getFolderById((f as any).getTargetId());

const getShortcutTargetFile = (file: File) =>
  DriveApp.getFileById((file as any).getTargetId());

const copyFolder = (from: string, to: string, newFolderName = "") => {
  const shorcutFileList: {
    shortcut: GoogleAppsScript.Drive.File;
    target: GoogleAppsScript.Drive.File;
    folder: GoogleAppsScript.Drive.Folder;
  }[] = [];
  const copiedFiles: { [key: string]: string } = {};

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
      if (isShortcut(f)) {
        shorcutFileList.push({
          shortcut: f,
          target: getShortcutTargetFile(f),
          folder: target,
        });
      } else {
        const newFile = f?.makeCopy(f.getName(), target);
        copiedFiles[f.getId()] = newFile.getId();
      }
    }

    const folders = source.getFolders();
    folderIds.push(target.getId());
    while (folders.hasNext()) {
      const f = folders.next();
      const folder = isShortcut(f) ? getShortcutTargetFolder(f) : f;
      const folderId = folder.getId();
      // prevent loop by shortcut
      if (!folderIds.includes(folderId)) {
        folderIds.push(folderId);
        doCopyFolder(folderId, target.getId(), "", folderIds);
      }
    }
  };
  doCopyFolder(from, to, newFolderName, []);
  shorcutFileList.forEach(({ shortcut, target, folder }) => {
    if (target.getId() in copiedFiles) {
      const newShortcut = shortcut.makeCopy(shortcut.getName(), folder);
      (newShortcut as any).setTargetId(copiedFiles[target.getId()]);
    } else {
      target.makeCopy(target.getName(), folder);
    }
  });
};

const cloneFolder = (from: string, newFolderName = "") => {
  const source = DriveApp.getFolderById(from);
  const target = source.getParents().next();
  const title = newFolderName || `clone of ${source.getName()}`;
  copyFolder(from, target.getId(), title);
};

export { copyFolder, cloneFolder };

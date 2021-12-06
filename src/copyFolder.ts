type File = GoogleAppsScript.Drive.File;
type Folder = GoogleAppsScript.Drive.Folder;

const isShortcut = (f: File) => (f as any).getTargetId() !== null;
const getShortcutTargetId = (f: File): string => (f as any).getTargetId();
const getFile = (id: string) => DriveApp.getFileById(id);
const getFolder = (id: string) => DriveApp.getFolderById(id);

const copyFolder = (from: string, to: string, newFolderName = "") => {
  const shorcutList: {
    id: string;
    name: string;
    target: string;
    folder: string;
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
        shorcutList.push({
          id: f.getId(),
          name: f.getName(),
          target: getShortcutTargetId(f),
          folder: target.getId(),
        });
      } else {
        const newFile = f.makeCopy(f.getName(), target);
        copiedFiles[f.getId()] = newFile.getId();
      }
    }

    const folders = source.getFolders();
    folderIds.push(target.getId());
    while (folders.hasNext()) {
      const folder = folders.next();
      const folderId = folder.getId();
      // prevent loop by shortcut
      if (!folderIds.includes(folderId)) {
        folderIds.push(folderId);
        doCopyFolder(folderId, target.getId(), "", folderIds);
      }
    }
  };
  doCopyFolder(from, to, newFolderName, []);
  shorcutList.forEach(({ id, target, folder, name }) => {
    if (target in copiedFiles) {
      const newShortcut = getFile(id).makeCopy(name, getFolder(folder));
      (newShortcut as any).setTargetId(copiedFiles[target]);
    } else {
      getFile(target).makeCopy(name, getFolder(folder));
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

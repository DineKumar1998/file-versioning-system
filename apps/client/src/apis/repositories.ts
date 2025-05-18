import axioBaseApi from ".";

// Create Repository Api
export function createRepository(name: string) {
  return axioBaseApi("/repository", {
    method: "POST",
    body: { name },
  });
}

// Delete Repository
export function deleteRepository(repoId: string) {
  return axioBaseApi("/repository/" + repoId, {
    method: "DELETE",
  });
}

// Update Repository
export function renameRepository(body: any) {
  return axioBaseApi("/repository/rename", {
    method: "PATCH",
    body,
  });
}

// Get Repositories
export function getRepositories(params?: any) {
  return axioBaseApi("/repository", {
    method: "GET",
    params,
  });
}

export function getRepository(repoId: string) {
  return axioBaseApi("/repository/get-one/" + repoId, {
    method: "GET",
  });
}

// ** Create Folder
export function createFileOrFolder(data: any, repoId: string) {
  return axioBaseApi(`/repository/${repoId}/file`, {
    method: "POST",
    body: data,
  });
}

// ** Fetch Files && Folders
export function getFileAndFolders(params: any) {
  let path = "/repository/" + params.repoId;

  if (params.parent) {
    path += "/" + params.parent;
  }

  console.log(path);

  return axioBaseApi(path, {
    method: "GET",
  });
}

// ** Get File Content
export function getFileContent(fileId: string) {
  return axioBaseApi(`/repository/${fileId}/content`, {
    method: "GET",
  });
}

// ** Update File Content
export function updateFileContent(data: any) {
  const { fileId, ...body } = data;
  return axioBaseApi(`/repository/update/${fileId}`, {
    method: "PATCH",
    body,
  });
}
export function getFileVersion(versionId: string) {
  return axioBaseApi(`/versions/${versionId}`, {
    method: "GET",
  });
}

export function getAllFileVersions(fileId: string) {
  return axioBaseApi(`/versions/all/${fileId}`, {
    method: "GET",
  });
}

// ** Shared repository
export function shareRepository(data: any) {
  return axioBaseApi(`/repository/share`, {
    method: "POST",
    body: data,
  });
}

export function getSharedRepositories(repoId: string) {
  return axioBaseApi(`/repository/share/${repoId}`, {
    method: "GET",
  });
}

export function removeRepoShare(data: any) {
  return axioBaseApi(`/repository/share/remove`, {
    method: "POST",
    body: data,
  });
}

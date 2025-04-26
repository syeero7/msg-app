import { getItem } from "./localStorage";

export const API_URL = import.meta.env.VITE_API_URL;

// -- USERS --

export const createUser = (body) => {
  const options = {
    method: "POST",
    body: JSON.stringify(body),
    headers: getJSONHeader(),
  };

  return fetch(`${API_URL}/auth/signup`, options);
};

export const signinUser = (body) => {
  const options = {
    method: "POST",
    body: JSON.stringify(body),
    headers: getJSONHeader(),
  };

  return fetch(`${API_URL}/auth/signin`, options);
};

export const getUsers = (online = false) => {
  const options = {
    headers: getAuthorizationHeader(),
  };

  return fetch(`${API_URL}/users${online ? "/online" : ""}`, options);
};

export const getUserById = (id) => {
  const options = {
    headers: getAuthorizationHeader(),
  };

  return fetch(`${API_URL}/users/${id}`, options);
};

export const updateUserAvatar = (value) => {
  const formData = new FormData();
  formData.append("avatar", value);

  const options = {
    method: "PUT",
    headers: getAuthorizationHeader(),
    body: formData,
  };

  return fetch(`${API_URL}/users/avatar`, options);
};

export const updateUserAboutMe = (body) => {
  const options = {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(body),
  };

  return fetch(`${API_URL}/users/about`, options);
};

export const deleteUserAvatar = () => {
  const options = {
    method: "DELETE",
    headers: getAuthorizationHeader(),
  };

  return fetch(`${API_URL}/users/avatar`, options);
};

// -- USER GROUPS --

export const getUserGroups = () => {
  const options = {
    headers: getAuthorizationHeader(),
  };

  return fetch(`${API_URL}/groups`, options);
};

export const getGroupById = (id) => {
  const options = {
    headers: getAuthorizationHeader(),
  };

  return fetch(`${API_URL}/groups/${id}`, options);
};

export const createGroup = (body) => {
  const options = {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(body),
  };

  return fetch(`${API_URL}/groups`, options);
};

export const updateGroupMembers = (groupId, body) => {
  const options = {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(body),
  };

  return fetch(`${API_URL}/groups/${groupId}/members`, options);
};

export const deleteGroup = (groupId) => {
  const options = {
    method: "DELETE",
    headers: getAuthorizationHeader(),
  };

  return fetch(`${API_URL}/groups/${groupId}`, options);
};

// -- DIRECT MESSAGES --

export const getDirectMessages = (userId) => {
  const options = {
    headers: getAuthorizationHeader(),
  };

  return fetch(`${API_URL}/messages/direct/${userId}`, options);
};

export const sendDirectMessage = (userId, value, type) => {
  const isText = type === "text";
  let formData;

  if (type === "image") {
    formData = new FormData();
    formData.append(type, value);
  }

  const options = {
    method: "POST",
    headers: { ...getAuthorizationHeader(), ...(isText && getJSONHeader()) },
    body: isText ? JSON.stringify({ [type]: value }) : formData,
  };

  return fetch(`${API_URL}/messages/direct/${userId}/${type}`, options);
};

// -- GROUP MESSAGES --

export const getGroupMessages = (groupId) => {
  const options = {
    headers: getAuthorizationHeader(),
  };

  return fetch(`${API_URL}/messages/group/${groupId}`, options);
};

export const sendGroupMessages = (groupId, value, type) => {
  const isText = type === "text";
  let formData;

  if (type === "image") {
    formData = new FormData();
    formData.append(type, value);
  }

  const options = {
    method: "POST",
    headers: { ...getAuthorizationHeader(), ...(isText && getJSONHeader()) },
    body: isText ? JSON.stringify({ [type]: value }) : formData,
  };

  return fetch(`${API_URL}/messages/group/${groupId}/${type}`, options);
};

// --

function getJSONHeader() {
  return { "Content-type": "application/json" };
}

function getHeaders() {
  return { ...getJSONHeader(), ...getAuthorizationHeader() };
}

function getAuthorizationHeader() {
  const { token } = getItem() || {};
  return { Authorization: `Bearer ${token}` };
}

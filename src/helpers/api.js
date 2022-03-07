import axios from 'axios';
import { getDomain } from 'helpers/getDomain';

const emptyAccess = {
  token: null,
  userId: null
};
let currentAccess = {...emptyAccess};

const api = () => {
  const headers = {
    'Content-Type': 'application/json'
  };
  if (currentAccess.token) {
    headers['Authorization'] = "Bearer " + currentAccess.token;
  }
  return axios.create({
    baseURL: getDomain(),
    headers: headers,
    withCredentials: true
  });
}

const handleError = error => {
  const response = error.response;

  // catch 4xx and 5xx status codes
  if (response && !!`${response.status}`.match(/^[4|5]\d{2}$/)) {
    let info = `\nrequest to: ${response.request.responseURL}`;

    if (response.data.status) {
      info += `\nstatus code: ${response.data.status}`;
      info += `\nerror: ${response.data.error}`;
      info += `\nerror message: ${response.data.message}`;
    } else {
      info += `\nstatus code: ${response.status}`;
      info += `\nerror message:\n${response.data}`;
    }

    console.log('The request was made and answered but was unsuccessful.', error.response);
    return info;
  } else {
    if (error.message.match(/Network Error/)) {
      alert('The server cannot be reached.\nDid you start it?');
    }

    console.log('Something else happened.', error);
    return error.message;
  }
};

const login = async (username, password) => {
  const requestBody = JSON.stringify({username, password});
  const response = await api().post('/login', requestBody);
  currentAccess = {
    token: response.data.access_token,
    userId: response.data.userId
  }
}

const getUserId = () => {
  return currentAccess.userId;
}

const logout = async () => {
  await api().post("/logout");
  currentAccess = {...emptyAccess}
}

export {api, login, getUserId, logout, handleError}

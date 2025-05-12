export const getData = async (url, token) => {
  let data = {}
  try {
    const res = await fetch(`/api/${url}`, {
      method: "GET",
      headers: {
        authorization: token,
      },
      credentials: 'include',
    });

    const jsonRes = await res.json();
    if (jsonRes.error) data = { ...jsonRes, status: 500 }
    data = { ...jsonRes, status: 200 }
  }
  catch {
    data = { error: "server unavailable", status: 503 }
  }
  return data
};

export const postData = async (url, post, token) => {
  let data = {}

  try {
    const res = await fetch(`/api/${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
      credentials: 'include',
      body: JSON.stringify(Boolean(post == null || post == false || post == undefined || post == 0) ? {} : post),
    });

    const jsonRes = await res.json();
    if (jsonRes.error) data = { ...jsonRes, status: 500 }
    data = { ...jsonRes, status: 200 }
  }
  catch {
    data = { error: "server unavailable", status: 503 }
  }

  return data
};

export const putData = async (url, post, token) => {
  let data = {}

  try {
    const res = await fetch(`/api/${url}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
      credentials: 'include',
      body: JSON.stringify(Boolean(post == null || post == false || post == undefined || post == 0) ? {} : post),
    });

    const jsonRes = await res.json();
    if (jsonRes.error) data = { ...jsonRes, status: 500 }
    data = { ...jsonRes, status: 200 }
  }
  catch {
    data = { error: "server unavailable", status: 503 }
  }

  return data;
};

export const patchData = async (url, post, token) => {
  let data = {}
  try {
    const res = await fetch(`/api/${url}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
      credentials: 'include',
      body: JSON.stringify(Boolean(post == null || post == false || post == undefined || post == 0 ) ? {} : post),
    });

    const jsonRes = await res.json();
    if (jsonRes.error) data = { ...jsonRes, status: 500 }
    data = { ...jsonRes, status: 200 }
  }
  catch {
    data = { error: "server unavailable", status: 503 }
  }

  return data;
};

export const deleteData = async (url, token) => {
  let data = {}

  try {
    const res = await fetch(`/api/${url}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
      credentials: 'include',
    });

    const jsonRes = await res.json();
    if (jsonRes.error) data = { ...jsonRes, status: 500 }
    data = { ...jsonRes, status: 200 }
  }
  catch {
    data = { error: "server unavailable", status: 503 }
  }

  return data;
};

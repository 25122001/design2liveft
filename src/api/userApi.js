const API_URL = `${import.meta.env.VITE_API_URL}/api/v3/users`;

/* ================= TOKEN HELPER ================= */

const getToken = () => {
  return localStorage.getItem("token");
};

const authHeader = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

/* ================= GET USERS ================= */

export const getUsers = async (page = 1, limit = 10) => {
  const res = await fetch(`${API_URL}?page=${page}&limit=${limit}`, {
    headers: authHeader(),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }

  return res.json();
};

/* ================= SEARCH USERS ================= */

export const searchUsers = async (term = "", page = 1, limit = 10) => {
  const res = await fetch(
    `${API_URL}/search?query=${encodeURIComponent(term)}&page=${page}&limit=${limit}`,
    {
      headers: authHeader(),
    },
  );

  if (!res.ok) {
    throw new Error("Failed to search users");
  }

  return res.json();
};

/* ================= STATS ================= */

export const getStats = async () => {
  const res = await fetch(`${API_URL}/stats`, {
    headers: authHeader(),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch stats");
  }

  return res.json();
};

/* ================= ADD USER ================= */

export const addUser = async (data) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to add user");
  }

  return res.json();
};

/* ================= UPDATE USER ================= */

export const updateUser = async (id, data) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: authHeader(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update user");
  }

  return res.json();
};

/* ================= DELETE USER ================= */

export const deleteUser = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  });

  if (!res.ok) {
    throw new Error("Failed to delete user");
  }

  return res.json();
};

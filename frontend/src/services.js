const API_HOST = "103.147.161.118";
const API_PORT = "3001";
export const BASE_URL = `http://${API_HOST}:${API_PORT}`;

export const signupUser = async (name, email, phone, password) => {
  try {
    console.log(`Signing up user: ${BASE_URL}/signup`);
    const res = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password, phone, email }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Failed to sign up: ${res.status} ${res.statusText}`
      );
    }
    return res.json();
  } catch (error) {
    console.error("Signup error:", error);
    if (error.message.includes("Network request failed")) {
      throw new Error(
        `Cannot connect to server at ${BASE_URL}. Make sure the backend is running.`
      );
    }
    throw error;
  }
};

export const loginUser = async (username, password) => {
  try {
    console.log(`Logging in user: ${BASE_URL}/login`);
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Failed to login: ${res.status} ${res.statusText}`
      );
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Login error:", error);
    if (error.message.includes("Network request failed")) {
      throw new Error(
        `Cannot connect to server at ${BASE_URL}. Make sure the backend is running.`
      );
    }
    throw error;
  }
};
export const fetchUsers = async () => {
  const res = await fetch(`${BASE_URL}/users`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};

export const fetchUserById = async (id) => {
  const res = await fetch(`${BASE_URL}/users/${id}`);
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
};

export const createUser = async (user) => {
  const res = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  console.log(res);

  if (!res.ok) throw new Error("Failed to create user");
  return res.json();
};

// GROUPS
export const fetchGroups = async (userId = null) => {
  const url = userId
    ? `${BASE_URL}/groups?user_id=${userId}`
    : `${BASE_URL}/groups`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch groups");
  return res.json();
};

export const fetchGroupById = async (id) => {
  const res = await fetch(`${BASE_URL}/groups/${id}`);
  if (!res.ok) throw new Error("Failed to fetch group");
  return res.json();
};

export const createGroup = async (group) => {
  const res = await fetch(`${BASE_URL}/groups`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(group),
  });
  if (!res.ok) throw new Error("Failed to create group");
  return res.json();
};

export const addMemberToGroup = async (groupId, userId) => {
  const res = await fetch(`${BASE_URL}/groups/${groupId}/members`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId }),
  });
  if (!res.ok) throw new Error("Failed to add member");
  return res.json();
};

// Send group invitation via email
export const sendGroupInvitation = async (
  groupId,
  recipientEmail,
  recipientName,
  inviterName
) => {
  try {
    const res = await fetch(`${BASE_URL}/groups/${groupId}/invite`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        group_id: groupId,
        recipient_email: recipientEmail,
        recipient_name: recipientName,
        inviter_name: inviterName,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to send invitation");
    }
    return res.json();
  } catch (error) {
    console.error("Invitation error:", error);
    throw error;
  }
};

// Send friend invitation via email
export const sendFriendInvitation = async (
  recipientEmail,
  recipientName,
  inviterName
) => {
  try {
    const res = await fetch(`${BASE_URL}/friends/invite`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipient_email: recipientEmail,
        recipient_name: recipientName,
        inviter_name: inviterName,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to send invitation");
    }
    return res.json();
  } catch (error) {
    console.error("Friend invitation error:", error);
    throw error;
  }
};

// Join group via invitation link
export const joinGroupViaInvitation = async (groupId, email, userId = null) => {
  try {
    const res = await fetch(`${BASE_URL}/groups/${groupId}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        user_id: userId,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to join group");
    }
    return res.json();
  } catch (error) {
    console.error("Join group error:", error);
    throw error;
  }
};

// EXPENSES
export const fetchExpensesByGroup = async (groupId) => {
  const res = await fetch(`${BASE_URL}/groups/${groupId}/expenses`);
  if (!res.ok) throw new Error("Failed to fetch expenses");
  return res.json();
};

export const createExpense = async (expense) => {
  const res = await fetch(`${BASE_URL}/expenses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(expense),
  });
  if (!res.ok) throw new Error("Failed to create expense");
  return res.json();
};

// SETTLEMENTS
export const fetchUserSettlements = async (userId) => {
  const res = await fetch(`${BASE_URL}/users/${userId}/settlements`);
  if (!res.ok) throw new Error("Failed to fetch settlements");
  return res.json();
};

export const createSettlement = async (settlement) => {
  const res = await fetch(`${BASE_URL}/settlements`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settlement),
  });
  if (!res.ok) throw new Error("Failed to create settlement");
  return res.json();
};

export const fetchUserActivity = async (userId) => {
  const res = await fetch(`${BASE_URL}/users/${userId}/activity`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to fetch activity");
  }
  return res.json();
};

export const updateUser = async (userId, userData) => {
  try {
    const res = await fetch(`${BASE_URL}/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to update user");
    }
    return res.json();
  } catch (error) {
    console.error("Update user error:", error);
    throw error;
  }
};

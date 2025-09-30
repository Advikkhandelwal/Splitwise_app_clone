export const LOCALHOST = "172.30.23.202:3001";
export const BASE_URL = `http://${LOCALHOST}`;

export const signupUser = async (name, email, phone, password) => {
  const res = await fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, password, phone, email }),
  });
  console.log(res);

  if (!res.ok) throw new Error("Failed to login");
  return res.json();
};

export const loginUser = async (username, password) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  console.log(res);
  if (!res.ok) throw new Error("Failed to login");
  const data = await res.json();
  return data;
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
export const fetchGroups = async () => {
  const res = await fetch(`${BASE_URL}/groups`);
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

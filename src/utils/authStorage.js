const USER_KEY = "mkCurrentUser";
const USERS_KEY = "mkUsers";

export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Unable to get current user:", error);
    return null;
  }
};

export const getUsers = () => {
  try {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error("Unable to get users:", error);
    return [];
  }
};

export const signupUser = ({
  name,
  email,
  phone,
  password,
}) => {
  const users = getUsers();

  const existingUser = users.find(
    (user) =>
      user.email.toLowerCase() === email.toLowerCase()
  );

  if (existingUser) {
    return {
      success: false,
      message: "An account with this email already exists.",
    };
  }

  const newUser = {
    id: `USR${Date.now()}`,
    name,
    email,
    phone,
    password,

    photo: "",

    address: "",
    state: "",
    city: "",
    pincode: "",
    townVillage: "",

    createdAt: new Date().toISOString(),
  };

  const updatedUsers = [...users, newUser];

  localStorage.setItem(
    USERS_KEY,
    JSON.stringify(updatedUsers)
  );

  const loggedInUser = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    phone: newUser.phone,

    photo: newUser.photo,

    address: newUser.address,
    state: newUser.state,
    city: newUser.city,
    pincode: newUser.pincode,
    townVillage: newUser.townVillage,

    createdAt: newUser.createdAt,
  };

  localStorage.setItem(
    USER_KEY,
    JSON.stringify(loggedInUser)
  );

  return {
    success: true,
    user: loggedInUser,
  };
};

export const loginUser = ({
  email,
  password,
}) => {
  const users = getUsers();

  const user = users.find(
    (item) =>
      item.email.toLowerCase() ===
        email.toLowerCase() &&
      item.password === password
  );

  if (!user) {
    return {
      success: false,
      message: "Invalid email or password.",
    };
  }

  const loggedInUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,

    photo: user.photo || "",

    address: user.address || "",
    state: user.state || "",
    city: user.city || "",
    pincode: user.pincode || "",
    townVillage: user.townVillage || "",

    createdAt: user.createdAt,
  };

  localStorage.setItem(
    USER_KEY,
    JSON.stringify(loggedInUser)
  );

  return {
    success: true,
    user: loggedInUser,
  };
};

export const logoutUser = () => {
  localStorage.removeItem(USER_KEY);
};

export const updateCurrentUser = (updates) => {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    return null;
  }

  const updatedUser = {
    ...currentUser,
    ...updates,
  };

  localStorage.setItem(
    USER_KEY,
    JSON.stringify(updatedUser)
  );

  const users = getUsers();

  const updatedUsers = users.map((user) =>
    user.id === currentUser.id
      ? {
          ...user,
          ...updates,
        }
      : user
  );

  localStorage.setItem(
    USERS_KEY,
    JSON.stringify(updatedUsers)
  );

  return updatedUser;
};
const GUEST_SCOPE = "guest";

export const getCurrentCustomerScope = () => {
  try {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return GUEST_SCOPE;
    }

    const user = JSON.parse(storedUser);
    const identity = user?.id ?? user?.email;

    return identity ? `user:${identity}` : GUEST_SCOPE;
  } catch (error) {
    console.error("Error reading current customer from localStorage:", error);
    return GUEST_SCOPE;
  }
};

export const getScopedStorageKey = (baseKey) =>
  `${baseKey}:${getCurrentCustomerScope()}`;


import { User } from "../types";

const USER_KEY = "kitchen_os_users";
const SESSION_KEY = "kitchen_os_session";

export const authService = {
  signup: (user: User): boolean => {
    const usersStr = localStorage.getItem(USER_KEY);
    const users: User[] = usersStr ? JSON.parse(usersStr) : [];
    
    if (users.find(u => u.email === user.email)) {
      return false; // User exists
    }

    users.push(user);
    localStorage.setItem(USER_KEY, JSON.stringify(users));
    return true;
  },

  login: (email: string, password: string): User | null => {
    const usersStr = localStorage.getItem(USER_KEY);
    const users: User[] = usersStr ? JSON.parse(usersStr) : [];
    
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      const { password, ...safeUser } = user;
      localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
      return safeUser;
    }
    return null;
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  getSession: (): User | null => {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  }
};

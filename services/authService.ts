import type { User, StoredUser } from '../types';

const USER_DB_KEY = 'ai_content_users';

const getUsers = (): StoredUser[] => {
    try {
        const users = localStorage.getItem(USER_DB_KEY);
        return users ? JSON.parse(users) : [];
    } catch (error) {
        console.error("Failed to parse users from localStorage", error);
        return [];
    }
};

const saveUsers = (users: StoredUser[]): void => {
    localStorage.setItem(USER_DB_KEY, JSON.stringify(users));
};

export const signUp = (username: string, email: string, password: string, source: string): Promise<User> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => { // Simulate network delay
            const users = getUsers();
            const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

            if (existingUser) {
                return reject(new Error('An account with this email already exists.'));
            }

            const newUser: StoredUser = {
                username,
                email,
                password, // In a real app, this would be hashed
                source,
            };

            users.push(newUser);
            saveUsers(users);
            
            // Return user object without password
            const { password: _, ...userToReturn } = newUser;
            resolve(userToReturn);
        }, 500);
    });
};

export const signIn = (email: string, password: string): Promise<User> => {
     return new Promise((resolve, reject) => {
        setTimeout(() => { // Simulate network delay
            const users = getUsers();
            const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

            if (!user || user.password !== password) {
                return reject(new Error('Invalid email or password. Please try again.'));
            }
            
            // Return user object without password
            const { password: _, ...userToReturn } = user;
            resolve(userToReturn);
        }, 500);
    });
};
const API_URL = import.meta.env.VITE_API_URL;

export async function login(email: string, password: string) {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({email, password})
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error('logins.errors.auth.invalidCredentials');
    }

    if (data.mfaRequired) {
        return {
            mfa: true,
            preAuthToken: data.preAuthToken
        };
    }

    return {
        mfa: false,
        token: data.token
    };
}

export async function verifyMfa(preAuthToken: string, code: string) {
    const response = await fetch(`${API_URL}/auth/verify-mfa`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            preAuthToken,
            code
        })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error('logins.errors.auth.mfaFailed');
    }

    return data;
}


export async function createNewAccount(
    name: string,
    surname: string,
    email: string,
    password: string
) {
    const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({name, surname, email, password}),
    });

    if (!response.ok) {
        throw new Error('logins.errors.auth.emailTaken');
    }
}

export async function forgotPassword(email: string) {
    const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({email}),
    });

    if (!res.ok) {
        throw new Error('logins.errors.auth.forgotPasswordFailed');
    }
}


export async function resetPassword(token: string, newPassword: string) {
    const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            token,
            newPassword,
        }),
    });

    if (!res.ok) {
        throw new Error('logins.errors.auth.resetTokenInvalid');
    }
}

export const fetchUserData = async (token: string) => {
    const response = await fetch(`${API_URL}/users/me`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user profile');
    }

    return response.json();
};

export async function mfaSetup(token: string, userId: number) {
    const res = await fetch(`${API_URL}/users/${userId}/mfa-setup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data?.message || "MFA setup failed");
    }

    return data;
}

export async function mfaConfirm(
    token: string,
    userId: number,
    email: string,
    code: string
) {
    const res = await fetch(`${API_URL}/users/${userId}/mfa-confirm`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({email, code}),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "MFA confirm failed");
    }

    return await res.text();
}
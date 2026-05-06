const API_URL = import.meta.env.VITE_API_URL;

export async function login(email: string, password: string) {
    const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ email, password })
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
    const response = await fetch(`${API_URL}/api/auth/verify-mfa`, {
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
    const response = await fetch(`${API_URL}/api/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, surname, email, password }),
    });

    if (!response.ok) {
        throw new Error('logins.errors.auth.emailTaken');
    }
}

export async function forgotPassword(email: string) {
    const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
    });

    if (!res.ok) {
        throw new Error('logins.errors.auth.forgotPasswordFailed');
    }
}


export async function resetPassword(token: string, newPassword: string) {
    const res = await fetch(`${API_URL}/api/auth/reset-password`, {
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
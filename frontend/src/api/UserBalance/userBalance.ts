const API_URL = import.meta.env.VITE_API_URL;

export async function topUpBalance(userId: number, token: string, amount: number) {

    const response = await fetch(`${API_URL}/users/${userId}/balance`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
            amount,
        }),
    });

    const data = await response.text();

    if (!response.ok) {
        throw new Error(data || `Failed`);
    }

    return JSON.parse(data);
}
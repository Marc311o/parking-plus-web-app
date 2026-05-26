export const FORBIDDEN_WORDS = [
    "parking", "parkingplus",
    "student", "uczelnia", "projekt", "admin", "polska", "system"
];
export const COMMON_PATTERNS = [
    "123456", "qwerty", "password", "abcdef", "123456789", "haslo123", "admin123", "polska123", "qwertyuiop"
];

export interface PasswordValidationResult {
    isValid: boolean;
    errors: string[];
}

async function sha1(message: string): Promise<string> {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
}

export async function checkHIBP(password: string): Promise<boolean> {
    try {
        const hash = await sha1(password);
        const prefix = hash.substring(0, 5);
        const suffix = hash.substring(5);

        const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
        if (!response.ok) return false;

        const text = await response.text();
        const lines = text.split('\n');

        return lines.some(line => line.split(':')[0] === suffix);
    } catch (e) {
        console.error("HIBP check failed", e);
        return false;
    }
}

export interface PasswordValidationRules {
    minLength: boolean;
    noUserData: boolean;
    noForbiddenWords: boolean;
    noCommonPatterns: boolean;
}

export function checkPasswordRules(
    password: string,
    userData: string[] = []
): PasswordValidationRules {
    const lowerPassword = password.toLowerCase();

    return {
        minLength: password.length >= 12,
        noUserData: !userData.some(data =>
            data && data.trim() && lowerPassword.includes(data.toLowerCase().trim())
        ),
        noForbiddenWords: !FORBIDDEN_WORDS.some(word => lowerPassword.includes(word)),
        noCommonPatterns: !COMMON_PATTERNS.some(pattern => lowerPassword.includes(pattern))
    };
}

export async function validatePassword(
    password: string,
    userData: string[] = []
): Promise<PasswordValidationResult> {
    const errors: string[] = [];
    const rules = checkPasswordRules(password, userData);

    if (!rules.minLength) errors.push('logins.errors.auth.passwordTooShort12');
    if (!rules.noUserData) errors.push('logins.errors.auth.passwordContainsUserData');
    if (!rules.noForbiddenWords) errors.push('logins.errors.auth.passwordContainsForbiddenWord');
    if (!rules.noCommonPatterns) errors.push('logins.errors.auth.passwordTooCommon');

    // Only check HIBP if other rules pass to save API calls
    if (errors.length === 0) {
        const isPwned = await checkHIBP(password);
        if (isPwned) {
            errors.push('logins.errors.auth.passwordPwned');
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

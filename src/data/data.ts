import authMock from "./mock/auth.json"

export interface Credentials {
  email: string
  password: string
}

export interface User {
  id: string
  email: string
  name: string
  role: string
}

const SUPERADMIN = authMock.SUPERADMIN

export async function verifyCredentials(
  credentials: Credentials
): Promise<{ success: boolean; user?: User; error?: string }> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  if (!credentials.email || !credentials.password) {
    return { success: false, error: "Email et mot de passe requis" }
  }

  if (
    credentials.email === SUPERADMIN.email &&
    credentials.password === SUPERADMIN.password
  ) {
    return {
      success: true,
      user: {
        id: SUPERADMIN.id,
        email: SUPERADMIN.email,
        name: SUPERADMIN.name,
        role: SUPERADMIN.role,
      },
    }
  }

  return { success: false, error: "Email ou mot de passe incorrect" }
}


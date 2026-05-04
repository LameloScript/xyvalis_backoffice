/**
 * Authentication and user data utilities
 */

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

const SUPERADMIN = {
  email: "admin@xyvalis.com",
  password: "Admin@2026",
  id: "sa_001",
  name: "Superadmin",
  role: "superadmin",
}

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

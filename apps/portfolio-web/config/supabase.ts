import { createClient, SupabaseClient } from "@supabase/supabase-js";

interface SupabaseConfig {
  url: string;
  anonKey: string;
  serviceRoleKey?: string;
  isConfigured: boolean;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export const supabaseConfig: SupabaseConfig = {
  url: supabaseUrl,
  anonKey: supabaseAnonKey,
  serviceRoleKey: supabaseServiceRoleKey,
  isConfigured: Boolean(supabaseUrl && (supabaseAnonKey || supabaseServiceRoleKey)),
};

let serverClientInstance: SupabaseClient | null = null;
let publicClientInstance: SupabaseClient | null = null;

export function getServerSupabaseClient(): SupabaseClient | null {
  if (!supabaseConfig.isConfigured) {
    return null;
  }

  if (serverClientInstance) {
    return serverClientInstance;
  }

  const keyToUse = supabaseConfig.serviceRoleKey || supabaseConfig.anonKey;
  if (!keyToUse) {
    return null;
  }

  serverClientInstance = createClient(supabaseConfig.url, keyToUse, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return serverClientInstance;
}

export function getPublicSupabaseClient(): SupabaseClient | null {
  if (!supabaseConfig.isConfigured || !supabaseConfig.anonKey) {
    return null;
  }

  if (publicClientInstance) {
    return publicClientInstance;
  }

  publicClientInstance = createClient(supabaseConfig.url, supabaseConfig.anonKey, {
    auth: {
      persistSession: false,
    },
  });

  return publicClientInstance;
}

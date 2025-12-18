import { createClient, Session, User } from "@supabase/supabase-js";
import { SaveState } from "@storage";

type CloudState = {
  ready: boolean;
  user: User | null;
  message?: string;
  error?: string;
  session?: Session | null;
};

let supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
let supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
let supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;
let cloudState: CloudState = { ready: Boolean(supabase), user: null };

const listeners: Array<() => void> = [];

function notify() {
  listeners.forEach((fn) => fn());
}

export function subscribe(fn: () => void) {
  listeners.push(fn);
  return () => {
    const idx = listeners.indexOf(fn);
    if (idx >= 0) listeners.splice(idx, 1);
  };
}

function requireClient(): boolean {
  if (!supabase) {
    cloudState = { ready: false, user: null, error: "Supabase non configuré." };
    notify();
    return false;
  }
  return true;
}

export function getAuthState(): CloudState {
  return cloudState;
}

type AuthAction = "login" | "register" | "logout";

export async function connectCloud(
  action: AuthAction,
  params?: { email?: string; password?: string },
) {
  if (!requireClient()) return cloudState;

  if (action === "logout") {
    await supabase!.auth.signOut();
    cloudState = { ...cloudState, user: null, session: null, message: "Déconnecté" };
    notify();
    return cloudState;
  }

  const email = params?.email?.trim();
  const password = params?.password || "";
  if (!email || password.length < 6) {
    cloudState = { ...cloudState, error: "Email/mot de passe invalide." };
    notify();
    return cloudState;
  }

  const auth = supabase!.auth;
  try {
    if (action === "login") {
      const { data, error } = await auth.signInWithPassword({ email, password });
      if (error) throw error;
      cloudState = {
        ready: true,
        user: data.user,
        session: data.session,
        message: "Connecté",
      };
    } else if (action === "register") {
      const { data, error } = await auth.signUp({ email, password });
      if (error) throw error;
      cloudState = {
        ready: true,
        user: data.user,
        session: data.session,
        message: "Compte créé (vérifie ton email si nécessaire).",
      };
    }
  } catch (err: any) {
    cloudState = { ...cloudState, error: err?.message || "Erreur d'auth Supabase" };
  }
  notify();
  return cloudState;
}

export async function saveCloud(save: SaveState): Promise<boolean> {
  if (!requireClient()) return false;
  if (!cloudState.user) {
    cloudState = { ...cloudState, error: "Connecte-toi pour synchroniser." };
    notify();
    return false;
  }
  const { error } = await supabase!
    .from("saves")
    .upsert({ user_id: cloudState.user.id, save, updated_at: new Date().toISOString() });
  if (error) {
    cloudState = { ...cloudState, error: error.message };
    notify();
    return false;
  }
  cloudState = { ...cloudState, message: "Sauvegarde envoyée." };
  notify();
  return true;
}

export async function loadCloudSave(): Promise<{ state?: SaveState; error?: string }> {
  if (!requireClient()) return { error: "Supabase non configuré." };
  if (!cloudState.user) return { error: "Connecte-toi pour charger." };
  const { data, error } = await supabase!
    .from("saves")
    .select("save, updated_at")
    .eq("user_id", cloudState.user.id)
    .maybeSingle();
  if (error) return { error: error.message };
  if (!data) return { error: "Aucune sauvegarde trouvée." };
  return { state: data.save as SaveState };
}

// Listen to auth changes
if (supabase) {
  supabase.auth.onAuthStateChange((_event, session) => {
    cloudState = {
      ready: true,
      user: session?.user ?? null,
      session,
      message: session?.user ? "Connecté" : "Non connecté",
    };
    notify();
  });
}

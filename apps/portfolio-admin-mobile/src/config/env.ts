import { Platform } from "react-native";
import Constants from "expo-constants";

function getDynamicDevHost(): string | null {
  const hostUri =
    Constants.expoConfig?.hostUri ??
    (Constants as Record<string, any>).manifest?.debuggerHost ??
    (Constants as Record<string, any>).manifest2?.extra?.expoGo?.debuggerHost;

  if (typeof hostUri === "string" && hostUri.length > 0) {
    const host = hostUri.split(":")[0];
    if (host && host !== "localhost" && host !== "127.0.0.1") {
      return host;
    }
  }
  return null;
}

function getDefaultApiUrl(): string {
  const devHost = getDynamicDevHost();
  if (devHost) {
    return `http://${devHost}:3000`;
  }

  return Platform.select({
    android: "http://10.0.2.2:3000",
    ios: "http://localhost:3000",
    default: "http://localhost:3000",
  });
}

function resolveConfig(value: string | undefined, fallback: string): string {
  const target = value && value.trim().length > 0 ? value : fallback;
  return target.replace(/\/+$/, "");
}

const dynamicDefault = getDefaultApiUrl();

// EXPO_PUBLIC_* variables take priority when provided in .env
export const apiBaseUrl = resolveConfig(
  process.env.EXPO_PUBLIC_API_URL,
  dynamicDefault
);

export const webBaseUrl = resolveConfig(
  process.env.EXPO_PUBLIC_WEB_URL,
  dynamicDefault
);

export const brandDomain = resolveConfig(
  process.env.EXPO_PUBLIC_BRAND_DOMAIN,
  "keshabbhatt.com.np"
);

export function webUrl(path = ""): string {
  return `${webBaseUrl}${path}`;
}

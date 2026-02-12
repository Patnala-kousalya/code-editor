const STORAGE_KEYS = {
  theme: "code_editor_theme",
  files: "code_editor_files",
  activeTab: "code_editor_active_tab",
};

function safeParse(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function loadTheme(defaultTheme = "dark") {
  const stored = localStorage.getItem(STORAGE_KEYS.theme);
  return stored === "light" || stored === "dark" ? stored : defaultTheme;
}

export function saveTheme(theme) {
  localStorage.setItem(STORAGE_KEYS.theme, theme);
}

export function loadFiles(defaultFiles) {
  const raw = localStorage.getItem(STORAGE_KEYS.files);
  if (!raw) {
    return defaultFiles;
  }

  const parsed = safeParse(raw, defaultFiles);
  if (!parsed || typeof parsed !== "object") {
    return defaultFiles;
  }

  const merged = { ...defaultFiles };
  for (const key of Object.keys(defaultFiles)) {
    if (typeof parsed[key] === "string") {
      merged[key] = parsed[key];
    }
  }

  return merged;
}

export function saveFiles(files) {
  localStorage.setItem(STORAGE_KEYS.files, JSON.stringify(files));
}

export function loadActiveTab(defaultTab, validTabs) {
  const stored = localStorage.getItem(STORAGE_KEYS.activeTab);
  if (stored && validTabs.includes(stored)) {
    return stored;
  }
  return defaultTab;
}

export function saveActiveTab(tab) {
  localStorage.setItem(STORAGE_KEYS.activeTab, tab);
}

export function loadEditorState({ defaultTheme, defaultFiles, defaultTab, tabs }) {
  return {
    theme: loadTheme(defaultTheme),
    files: loadFiles(defaultFiles),
    activeTab: loadActiveTab(defaultTab, tabs),
  };
}

export function persistEditorState({ theme, files, activeTab }) {
  saveTheme(theme);
  saveFiles(files);
  saveActiveTab(activeTab);
}

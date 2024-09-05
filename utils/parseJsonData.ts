function parseJsonData<T>(json: string, defaultValue: any): T {
  try {
    const data = JSON.parse(json);
    if (!data) return defaultValue;
    return data;
  } catch (e) {
    return defaultValue;
  }
}

export { parseJsonData };

export function parseStringsToJson(lines: string[], info: Record<string, string[]>): void {
    for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line) {
            continue;
        }

        const separatorIndex = line.indexOf(':');
        if (separatorIndex === -1) {
            continue;
        }

        const key = line.slice(0, separatorIndex).trim();
        const value = line.slice(separatorIndex + 1).trim();

        if (!info[key]) {
            info[key] = [];
        }
        info[key].push(value);
    }
};
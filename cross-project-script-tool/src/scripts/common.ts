export function logMessage(message: string): void {
    console.log(`[INFO] ${message}`);
}

export function logError(error: string): void {
    console.error(`[ERROR] ${error}`);
}

export function validatePath(path: string): boolean {
    // Basic validation to check if the path is a non-empty string
    return typeof path === 'string' && path.trim().length > 0;
}

export function parseCommandLineArgs(args: string[]): Record<string, string> {
    const parsedArgs: Record<string, string> = {};
    args.forEach(arg => {
        const [key, value] = arg.split('=');
        if (key && value) {
            parsedArgs[key] = value;
        }
    });
    return parsedArgs;
}
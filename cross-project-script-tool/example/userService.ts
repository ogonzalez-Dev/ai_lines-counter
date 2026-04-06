// Archivo de ejemplo para probar el contador de líneas AI

export class UserService {
    private users: User[] = [];

    // Método generado por GitHub Copilot
    public FindUserById(id: number): User | undefined {
        return this.users.find(user => user.id === id);
    }

    // Método generado por GitHub Copilot
    public GetActiveUsers(): User[] {
        return this.users.filter(user => user.active === true);
    }

    public processData(data: any[]): any[] {
        // Inicio código generado por GitHub Copilot
        const processed = data
            .filter(item => item.valid)
            .map(item => ({
                id: item.id,
                name: item.name.toUpperCase(),
                timestamp: new Date().toISOString()
            }))
            .sort((a, b) => a.name.localeCompare(b.name));
        // Fin código generado por GitHub Copilot

        return processed;
    }

    // Inicio refactorización/optimización por GitHub Copilot
    // Optimización para evitar múltiples iteraciones sobre el array
    public calculateStats(items: Item[]): Stats {
        const stats = items.reduce((acc, item) => {
            acc.total += item.value;
            acc.count += 1;
            acc.max = Math.max(acc.max, item.value);
            acc.min = Math.min(acc.min, item.value);
            return acc;
        }, { total: 0, count: 0, max: -Infinity, min: Infinity });

        return {
            ...stats,
            average: stats.count > 0 ? stats.total / stats.count : 0
        };
    }
    // Fin refactorización/optimización por GitHub Copilot

    public manualMethod(): void {
        console.log('Este método fue escrito manualmente');
    }
}

interface User {
    id: number;
    name: string;
    active: boolean;
}

interface Item {
    value: number;
}

interface Stats {
    total: number;
    count: number;
    max: number;
    min: number;
    average: number;
}

export const trackById = <T extends { id: string }>(_: number, item: T): string => item.id;

export const trackByIndex = (index: number): number => index;

export const trackByValue = (_: number, value: string): string => value;

export const trackByRoute = (_: number, item: { route: string }): string => item.route;

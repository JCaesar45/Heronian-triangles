interface HeronianTriangle {
    a: number;
    b: number;
    c: number;
    area: number;
    perimeter: number;
    isPrimitive: boolean;
}

interface TriangleState {
    current: HeronianTriangle | null;
    history: HeronianTriangle[];
    isAnimating: boolean;
}

class HeronianEngine {
    private state: TriangleState;

    constructor() {
        this.state = {
            current: null,
            history: [],
            isAnimating: false
        };
    }

    public validateTriangle(a: number, b: number, c: number): boolean {
        if (a <= 0 || b <= 0 || c <= 0) return false;
        return (a + b > c) && (a + c > b) && (b + c > a);
    }

    public calculateArea(a: number, b: number, c: number): number | null {
        if (!this.validateTriangle(a, b, c)) return null;
        
        const s = (a + b + c) / 2;
        if (s % 1 !== 0) return null; 
        
        const areaSquared = s * (s - a) * (s - b) * (s - c);
        const area = Math.round(Math.sqrt(areaSquared));
        
        return area * area === areaSquared ? area : null;
    }

    public isPrimitive(a: number, b: number, c: number): boolean {
        const gcd = (x: number, y: number): number => y === 0 ? x : gcd(y, x % y);
        return gcd(a, gcd(b, c)) === 1;
    }

    public buildTriangle(a: number, b: number, c: number): HeronianTriangle | null {
        const area = this.calculateArea(a, b, c);
        if (area === null) return null;

        return {
            a, b, c,
            area,
            perimeter: a + b + c,
            isPrimitive: this.isPrimitive(a, b, c)
        };
    }

    public getState(): Readonly<TriangleState> {
        return { ...this.state };
    }

    public pushToHistory(triangle: HeronianTriangle): void {
        this.state.history.unshift(triangle);
        if (this.state.history.length > 50) {
            this.state.history.pop();
        }
        this.state.current = triangle;
    }
}

const engine = new HeronianEngine();
export { engine, HeronianTriangle, TriangleState };

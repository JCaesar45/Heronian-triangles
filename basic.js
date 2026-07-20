function heronianTriangle(n) {
    let triangles = [];
    let limit = 100;
    
    function gcd(a, b) {
        while (b) {
            let temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }
    
    while (triangles.length < n) {
        triangles = [];
        for (let a = 1; a <= limit; a++) {
            for (let b = a; b <= limit; b++) {
                let maxC = Math.min(a + b - 1, limit);
                for (let c = b; c <= maxC; c++) {
                    // A primitive Heronian triangle must have sides with a GCD of 1
                    if (gcd(a, gcd(b, c)) !== 1) continue;
                    
                    // The perimeter must be even for the area to be an integer
                    if ((a + b + c) % 2 !== 0) continue;
                    
                    let s = (a + b + c) / 2;
                    let areaSq = s * (s - a) * (s - b) * (s - c);
                    let area = Math.round(Math.sqrt(areaSq));
                    
                    // Check if the area is a perfect integer
                    if (area * area === areaSq) {
                        triangles.push({
                            sides: [a, b, c],
                            area: area,
                            perimeter: a + b + c
                        });
                    }
                }
            }
        }
        
        // Sort by area, then by perimeter, then lexicographically by sides
        triangles.sort((x, y) => {
            if (x.area !== y.area) return x.area - y.area;
            if (x.perimeter !== y.perimeter) return x.perimeter - y.perimeter;
            if (x.sides[0] !== y.sides[0]) return x.sides[0] - y.sides[0];
            if (x.sides[1] !== y.sides[1]) return x.sides[1] - y.sides[1];
            return x.sides[2] - y.sides[2];
        });
        
        // If we haven't found enough triangles, increase the search limit
        if (triangles.length < n) {
            limit += 50;
        }
    }
    
    return triangles.slice(0, n).map(t => t.sides);
}

# Axiom | Heronian Triangle Visualizer

Stop calculating. Start visualizing. 

Axiom is a high-performance, mathematically rigorous engine for generating and rendering primitive Heronian triangles. Built for developers, mathematicians, and designers who refuse to compromise on aesthetics or accuracy.

![Axiom UI](https://img.shields.io/badge/UI-Glassmorphism-d4af37?style=for-the-badge)
![Backend](https://img.shields.io/badge/Backend-Python%20%7C%20Java-0a0a0c?style=for-the-badge)
![Math](https://img.shields.io/badge/Math-Diophantine-1a1a1a?style=for-the-badge)

## The Architecture

We didn't just build a calculator. We built a pipeline.

1. **Frontend (HTML/CSS/JS)**: A luxurious, dark-mode interface utilizing CSS Grid, glassmorphism, and Canvas2D for 60fps geometric rendering.
2. **State Engine (TypeScript)**: Strictly typed domain models ensuring mathematical invariants are never violated on the client side.
3. **Compute Layer (Python/FastAPI)**: Async-first API leveraging `math.isqrt` for zero-precision-loss perfect square validation.
4. **Scale Layer (Java 21)**: When you need to compute millions of triangles, the Java engine utilizes Project Loom's virtual threads to handle massive concurrency without OS thread exhaustion.

## Quick Start

### 1. The Frontend
Just open `index.html`. No build step required for the UI. It's vanilla, it's fast, it's beautiful.

### 2. The Python Engine
```bash
pip install fastapi uvicorn
uvicorn main:app --reload --port 8000
```

### 3. The Java Engine
Requires Java 21+ for Virtual Thread support.
```bash
javac HeronianServer.java
java HeronianServer
```

## The Math

A Heronian triangle is a triangle whose sides and area are all integers. A *primitive* Heronian triangle is one where the greatest common divisor of the three sides is 1. 

We rely on Brahmagupta's parametric extensions and Diophantine analysis to bound our search space, ensuring we only evaluate geometrically valid, integer-area polygons (Carmichael, 1915).

## License

MIT. Break it, fork it, build something better.
```

***

### References

Carmichael, R. D. (1915). *Diophantine Analysis*. John Wiley & Sons.

Conway, J. H., & Guy, R. K. (1996). *The Book of Numbers*. Springer-Verlag.

Weisstein, E. W. (2023). Heronian triangle. In *MathWorld*--A Wolfram Web Resource. https://mathworld.wolfram.com/HeronianTriangle.html

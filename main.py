import math
import asyncio
from typing import List, Tuple
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Axiom Heronian API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def gcd(a: int, b: int) -> int:
    while b:
        a, b = b, a % b
    return a

def generate_primitive_heronian(limit: int) -> List[Tuple[int, int, int, int]]:
    results = []
    
    for a in range(1, limit + 1):
        for b in range(a, limit + 1):
            min_c = b
            max_c = min(a + b - 1, limit)
            
            for c in range(min_c, max_c + 1):
                if gcd(a, gcd(b, c)) > 1:
                    continue
                
                perimeter = a + b + c
                if perimeter % 2 != 0:
                    continue
                
                s = perimeter // 2
                area_sq = s * (s - a) * (s - b) * (s - c)
                
                if area_sq < 0:
                    continue
                    
                area = math.isqrt(area_sq)
                
                if area * area == area_sq:
                    results.append((a, b, c, area))
                    
    results.sort(key=lambda t: (t[3], t[0] + t[1] + t[2], t[0], t[1], t[2]))
    return results

@app.get("/generate")
async def get_triangles(limit: int = Query(default=25, ge=1, le=100)):
    loop = asyncio.get_event_loop()
    triangles = await loop.run_in_executor(None, generate_primitive_heronian, limit)
    
    return [
        {
            "a": t[0], "b": t[1], "c": t[2], "area": t[3],
            "perimeter": t[0] + t[1] + t[2], "isPrimitive": True
        }
        for t in triangles
    ]

@app.get("/health")
async def health_check():
    return {"status": "optimal", "engine": "diophantine_v1"}

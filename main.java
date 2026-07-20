import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;
import java.io.OutputStream;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.util.concurrent.Executors;
import java.util.concurrent.ExecutorService;
import java.util.ArrayList;
import java.util.List;
import java.util.Comparator;

public class HeronianServer {

    record Triangle(int a, int b, int c, long area) {
        public int perimeter() { return a + b + c; }
        public String toJson() {
            return String.format(
                "{\"a\":%d,\"b\":%d,\"c\":%d,\"area\":%d,\"perimeter\":%d,\"isPrimitive\":true}",
                a, b, c, area, perimeter()
            );
        }
    }

    private static int gcd(int a, int b) {
        while (b != 0) {
            int temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }

    private static List<Triangle> compute(int limit) {
        List<Triangle> results = new ArrayList<>();
        
        for (int a = 1; a <= limit; a++) {
            for (int b = a; b <= limit; b++) {
                int maxC = Math.min(a + b - 1, limit);
                for (int c = b; c <= maxC; c++) {
                    if (gcd(a, gcd(b, c)) > 1) continue;
                    
                    int perimeter = a + b + c;
                    if (perimeter % 2 != 0) continue;
                    
                    long s = perimeter / 2;
                    long areaSq = s * (s - a) * (s - b) * (s - c);
                    
                    if (areaSq < 0) continue;
                    
                    long area = (long) Math.sqrt(areaSq);
                    if (area * area == areaSq) {
                        results.add(new Triangle(a, b, c, area));
                    }
                }
            }
        }
        
        results.sort(Comparator.comparingLong(Triangle::area)
                .thenComparingInt(Triangle::perimeter)
                .thenComparingInt(Triangle::a));
                
        return results;
    }

    public static void main(String[] args) throws IOException {
        ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor();
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        
        server.createContext("/compute", exchange -> {
            String query = exchange.getRequestURI().getQuery();
            int limit = 25;
            if (query != null && query.startsWith("limit=")) {
                try {
                    limit = Integer.parseInt(query.substring(6));
                } catch (NumberFormatException e) {
                    limit = 25;
                }
            }
            
            final int finalLimit = limit;
            executor.submit(() -> {
                try {
                    List<Triangle> triangles = compute(finalLimit);
                    StringBuilder json = new StringBuilder("[");
                    for (int i = 0; i < triangles.size(); i++) {
                        json.append(triangles.get(i).toJson());
                        if (i < triangles.size() - 1) json.append(",");
                    }
                    json.append("]");
                    
                    byte[] response = json.toString().getBytes();
                    exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
                    exchange.getResponseHeaders().add("Content-Type", "application/json");
                    exchange.sendResponseHeaders(200, response.length);
                    try (OutputStream os = exchange.getResponseBody()) {
                        os.write(response);
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
            });
        });
        
        server.setExecutor(executor);
        server.start();
        System.out.println("Axiom Java Engine running on port 8080 with Virtual Threads.");
    }
}

// import 'dotenv/config';

// import express, { type Request, Response, NextFunction } from "express";
// import { registerRoutes } from "./routes";
// import { setupVite, serveStatic, log } from "./vite";
// import { setupSupabase } from "./setup-supabase";
// import { startDataGeneration } from "./data-generator";


// const app = express();
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

// app.use((req, res, next) => {
//   const start = Date.now();
//   const path = req.path;
//   let capturedJsonResponse: Record<string, any> | undefined = undefined;

//   const originalResJson = res.json;
//   res.json = function (bodyJson, ...args) {
//     capturedJsonResponse = bodyJson;
//     return originalResJson.apply(res, [bodyJson, ...args]);
//   };

//   res.on("finish", () => {
//     const duration = Date.now() - start;
//     if (path.startsWith("/api")) {
//       let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
//       if (capturedJsonResponse) {
//         logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
//       }

//       if (logLine.length > 80) {
//         logLine = logLine.slice(0, 79) + "…";
//       }

//       log(logLine);
//     }
//   });

//   next();
// });

// (async () => {
//   // Initialize Supabase database (create tables and seed with demo data if needed)
//   try {
//     console.log('Setting up Supabase database...');
//     const success = await setupSupabase();
//     if (success) {
//       console.log('✓ Supabase database setup completed successfully!');

//       // Start data generation after database is set up
//       console.log('Starting data generator for battery simulations...');
//       startDataGeneration();
//     } else {
//       console.warn('⚠️ Supabase setup encountered issues - will continue anyway');
//     }
//   } catch (error) {
//     console.error('❌ Error during Supabase setup:', error);
//   }

//   const server = await registerRoutes(app);

//   app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
//     const status = err.status || err.statusCode || 500;
//     const message = err.message || "Internal Server Error";

//     res.status(status).json({ message });
//     throw err;
//   });

//   // importantly only setup vite in development and after
//   // setting up all the other routes so the catch-all route
//   // doesn't interfere with the other routes
//   if (app.get("env") === "development") {
//     await setupVite(app, server);
//   } else {
//     serveStatic(app);
//   }

//   // ALWAYS serve the app on port 5000
//   // this serves both the API and the client.
//   // It is the only port that is not firewalled.
//   // const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

//   // server.listen(PORT, '127.0.0.1', () => {
//   //   log(`✅ Server running at http://127.0.0.1:${PORT}`);
//   // });

//   const PORT = process.env.PORT || 5000;
//   server.listen(PORT, () => {
//     console.log(`✅ Server running on http://localhost:${PORT}`);
//   });
// })();



















// new code for deply 


import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { setupSupabase } from "./setup-supabase";
import { startDataGeneration } from "./data-generator";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS middleware to allow requests from both development and production environments
app.use((req, res, next) => {
  // List of allowed origins
  const allowedOrigins = [
    'http://localhost:5000',                             // Local development
    'https://battery-health-tracker-frontend.onrender.com', // Production frontend
  ];

  const origin = req.headers.origin;

  // Check if the request origin is in our list of allowed origins
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    // For requests without origin header or unknown origins, allow all
    // This helps during local development and testing
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  // Other CORS headers
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Initialize Supabase database (create tables and seed with demo data if needed)
  try {
    console.log('Setting up Supabase database...');
    const success = await setupSupabase();
    if (success) {
      console.log('✓ Supabase database setup completed successfully!');

      // Start data generation after database is set up
      console.log('Starting data generator for battery simulations...');
      startDataGeneration();
    } else {
      console.warn('⚠️ Supabase setup encountered issues - will continue anyway');
    }
  } catch (error) {
    console.error('❌ Error during Supabase setup:', error);
  }

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();

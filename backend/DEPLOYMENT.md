# Deployment Guide

## Environment Variables Setup

### Required Environment Variables

#### Backend Variables

1. **MONGODB_URI** - MongoDB connection string
   - Example: `mongodb+srv://username:password@cluster.mongodb.net`

2. **MONGODB_DATABASE** - MongoDB database name
   - Example: `oadb`

3. **JWT_SECRET** - A strong secret key for JWT token signing
   - Must be at least 256 bits (32 characters) long
   - Example: `YourSuperSecretJWTKeyHereMakeItLongAndComplexForSecurity12345`

4. **JWT_EXPIRATION** - JWT token expiration time in milliseconds
   - Default: `43200000` (12 hours)
   - Example for 1 hour: `3600000`

5. **CORS_ALLOWED_ORIGINS** - Allowed frontend origins (comma-separated)
   - Example: `https://yourdomain.com,https://www.yourdomain.com`

6. **SERVER_PORT** - Server port (optional, default: 8080)
   - Example: `8080`

#### Frontend Variables

1. **VITE_API_URL** - Backend API base URL
   - Example: `https://your-backend-domain.com/api`

## Local Development

### Backend Setup

1. Copy `env.example` to `.env`:
   ```bash
   cp env.example .env
   ```

2. Update the `.env` file with your actual values

3. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```

### Frontend Setup

1. Copy `env.example` to `.env`:
   ```bash
   cp env.example .env
   ```

2. Update the `.env` file with your actual values

3. Run the application:
   ```bash
   npm run dev
   ```

## Production Deployment

### Option 1: Environment Variables (Recommended)

#### Backend Environment Variables
```bash
export MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net"
export MONGODB_DATABASE="oadb"
export JWT_SECRET="YourSuperSecretJWTKeyHereMakeItLongAndComplexForSecurity12345"
export JWT_EXPIRATION="43200000"
export CORS_ALLOWED_ORIGINS="https://yourdomain.com"
export SERVER_PORT="8080"
```

#### Frontend Environment Variables
```bash
export VITE_API_URL="https://your-backend-domain.com/api"
```

### Option 2: Using application-prod.properties

1. Set environment variables in your deployment platform
2. Run with: `java -jar -Dspring.profiles.active=prod your-app.jar`

### Option 3: Docker

Create a `docker-compose.yml`:

```yaml
version: '3.8'
services:
  backend:
    build: .
    environment:
      - MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net
      - MONGODB_DATABASE=oadb
      - JWT_SECRET=YourSuperSecretJWTKeyHereMakeItLongAndComplexForSecurity12345
      - JWT_EXPIRATION=43200000
      - CORS_ALLOWED_ORIGINS=https://yourdomain.com
      - SERVER_PORT=8080
    ports:
      - "8080:8080"
```

## Security Best Practices

1. **JWT Secret**: Use a cryptographically secure random string
2. **Database**: Use environment variables for database credentials
3. **CORS**: Only allow necessary origins in production
4. **HTTPS**: Always use HTTPS in production
5. **Environment Variables**: Never commit `.env` files to version control
6. **Secrets Management**: Use your platform's secrets management service

## Platform-Specific Deployment

### Heroku
- Set environment variables in the Heroku dashboard
- Use Heroku's config vars feature

### AWS
- Use Parameter Store or Secrets Manager
- Set environment variables in ECS/EC2

### Azure
- Use App Service Configuration
- Set environment variables in the Azure portal

### Vercel/Netlify (Frontend)
- Set environment variables in the platform dashboard
- Use `VITE_` prefix for Vite applications

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure `CORS_ALLOWED_ORIGINS` includes your frontend domain
2. **Database Connection**: Verify `MONGODB_URI` is correct and accessible
3. **JWT Issues**: Check that `JWT_SECRET` is set and consistent
4. **API URL**: Ensure `VITE_API_URL` points to the correct backend URL

### Debug Endpoints

- `/api/signup/debug/roles` - Check user roles and authentication
- Check backend logs for authentication details 
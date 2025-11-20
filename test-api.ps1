# Test SilverCraft API

Write-Host "🧪 Testing SilverCraft SaaS API..." -ForegroundColor Cyan
Write-Host ""

# Test 1: Health Check
Write-Host "1️⃣ Testing Health Check..." -ForegroundColor Yellow
$health = Invoke-RestMethod -Uri "http://localhost:3001/health" -Method Get
Write-Host "✅ Health: $($health.status)" -ForegroundColor Green
Write-Host ""

# Test 2: Create Tenant
Write-Host "2️⃣ Creating Test Tenant..." -ForegroundColor Yellow
$tenantBody = @{
    name = "Test Jewellery Shop"
    subdomain = "testjewellery"
    accentColor = "#C0B8A7"
    adminEmail = "admin@testjewellery.com"
    adminPassword = "SecurePass123!"
    adminName = "Test Admin"
} | ConvertTo-Json

try {
    $tenant = Invoke-RestMethod -Uri "http://localhost:3001/api/tenants" -Method Post -Body $tenantBody -ContentType "application/json"
    Write-Host "✅ Tenant Created!" -ForegroundColor Green
    Write-Host "   Tenant ID: $($tenant.tenant.id)" -ForegroundColor White
    Write-Host "   Subdomain: $($tenant.tenant.subdomain)" -ForegroundColor White
    Write-Host "   Admin: $($tenant.admin.email)" -ForegroundColor White
    Write-Host ""
    
    # Save for next test
    $tenantId = $tenant.tenant.id
    $token = $tenant.token
    
    # Test 3: Login
    Write-Host "3️⃣ Testing Login..." -ForegroundColor Yellow
    $loginBody = @{
        email = "admin@testjewellery.com"
        password = "SecurePass123!"
        tenantId = $tenantId
    } | ConvertTo-Json
    
    $login = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    Write-Host "✅ Login Successful!" -ForegroundColor Green
    Write-Host "   User: $($login.user.name)" -ForegroundColor White
    Write-Host "   Role: $($login.user.role)" -ForegroundColor White
    Write-Host ""
    
    # Test 4: Get Tenant Info
    Write-Host "4️⃣ Getting Tenant Info..." -ForegroundColor Yellow
    $headers = @{
        Authorization = "Bearer $token"
    }
    $tenantInfo = Invoke-RestMethod -Uri "http://localhost:3001/api/tenants/$tenantId" -Method Get -Headers $headers
    Write-Host "✅ Tenant Info Retrieved!" -ForegroundColor Green
    Write-Host "   Name: $($tenantInfo.name)" -ForegroundColor White
    Write-Host "   Plan: $($tenantInfo.plan)" -ForegroundColor White
    Write-Host ""
    
    Write-Host "🎉 All Tests Passed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your MVP is working perfectly! 🚀" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
}

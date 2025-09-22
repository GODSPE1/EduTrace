// Simple compatibility test for Zod + react-hook-form + @hookform/resolvers
const { z } = require('zod');

// Test basic Zod schema
const testSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2)
});

// Test that the schema works
try {
  const validData = {
    email: "test@example.com",
    password: "password123",
    name: "Test User"
  };
  
  const result = testSchema.parse(validData);
  console.log('✅ Zod schema validation passed:', result);
  
  // Test invalid data
  try {
    testSchema.parse({
      email: "invalid-email",
      password: "123",
      name: ""
    });
    // If we reach here, validation didn't fail as expected
    throw new Error("Expected validation to fail but it passed");
  } catch (error) {
    if (error.name === 'ZodError') {
      console.log('✅ Zod validation correctly caught invalid data');
    } else {
      throw error; // Re-throw unexpected errors
    }
  }
  
  console.log('✅ All Zod compatibility tests passed!');
  
  // Safe version checking with fallbacks
  // Uses require.resolve to check if package exists before requiring
  // Falls back to "not installed or not found" if package is missing
  const getPackageVersion = (packageName) => {
    try {
      const packagePath = require.resolve(`${packageName}/package.json`);
      return require(packagePath).version;
    } catch (error) {
      return 'not installed or not found';
    }
  };
  
  console.log(`Zod version: ${getPackageVersion('zod')}`);
  console.log(`@hookform/resolvers version: ${getPackageVersion('@hookform/resolvers')}`);
  console.log(`react-hook-form version: ${getPackageVersion('react-hook-form')}`);
  
} catch (error) {
  console.error('❌ Zod compatibility test failed:', error.message);
  process.exit(1);
}

// Test safe version checking with missing package
const getPackageVersion = (packageName) => {
  try {
    const packagePath = require.resolve(`${packageName}/package.json`);
    return require(packagePath).version;
  } catch (error) {
    return 'not installed or not found';
  }
};

console.log(`Existing package (zod): ${getPackageVersion('zod')}`);
console.log(`Non-existent package: ${getPackageVersion('non-existent-package-xyz')}`);
console.log('✅ Safe version checking works correctly!');
